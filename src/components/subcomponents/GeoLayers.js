import VectorTileLayer from 'ol/layer/VectorTile';
import geojsonvt from 'geojson-vt';
import GeoJSON from 'ol/format/GeoJSON';
import Projection from 'ol/proj/Projection';
import VectorTileSource from 'ol/source/VectorTile';
import center from '@turf/center';
import {bbox} from '@turf/turf'
import { View } from 'ol';
import { Fill, Style, Stroke } from 'ol/style';
import {getLayerById} from '../ol-utils/Utils'
import {Fill as MapFill} from '../../utils/Fill'
import {getRenderPixel} from 'ol/render.js';
import RenderEvent from 'ol/render/Event'

export default class GeoLayers {
    constructor(map, map_options, checked, plotted, setPlotted, activateSlider, dividerRange) {
        this.map = map;
        this.map_options = map_options;
        this.checked = checked;
        this.plotted = plotted;
        this.setPlotted = setPlotted;
        this.overlays = {};
        this.activateSlider = activateSlider;
        this.dividerRange = dividerRange
    }

    updateLayers() {
        //Check ids
        const checked_ids = this.checked.map(clayer => clayer.id);
        const plotted_ids = this.plotted.map(player => player.id);
        const new_plotted_layers = [...this.plotted];
        if(checked_ids.length > plotted_ids.length) { // If added layer
            const newLayer_id = checked_ids[checked_ids.length-1]

            //Retrieve Layer details
            fetch("https://geocem.centrodametropole.fflch.usp.br/api/layers/"+ newLayer_id)
            .then(function (response) {
                return response.json();
            })
            .then(response => {

                //Get link to GeoJSON
                const json_url = response.links.filter(link => link.name === 'GeoJSON')[0].url
                const https_json = (json_url.startsWith("http://")) ? "https://" + json_url.substring(7) : json_url
                
                const mapFill = new MapFill()
                const new_layer = {
                    id: newLayer_id,
                    name: response.title,
                    geojson_link: https_json,
                    attribute_to_symbolize: null,
                    mapFill: mapFill,
                    symbology: null,
                    panel: 0,
                    ol_layer: null
                }

                this.getLayerAttributes(newLayer_id).then( attributes => {
                    new_layer['attributes'] = attributes
                })
                
                new_plotted_layers.push(new_layer)
                this.setPlotted(new_plotted_layers)

                this.addVectorLayertoMap(new_layer, this.map, this.map_options)

            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });

        } else if(checked_ids.length < plotted_ids.length) { // If removed layer
            const diffElementIdx = plotted_ids.findIndex(pid => !checked_ids.includes(pid));
            new_plotted_layers.splice(diffElementIdx, 1);
            this.removeHighlight(this.plotted[diffElementIdx].id)
            this.setPlotted(new_plotted_layers)
            this.removeLayerOfMap(this.plotted[diffElementIdx])
        }

    }

    updateLayer(layer) {
        let new_plotted_layers = [...this.plotted];
        const indexToUpdate = new_plotted_layers.findIndex(pLayer => layer.id === pLayer.id);
        new_plotted_layers[indexToUpdate] = layer
        this.setPlotted(new_plotted_layers)
    }
    
    addVectorLayertoMap(layer, map, map_options) {
        //Create Vector Tile layer
        const vt_layer = new VectorTileLayer({properties: ['id', 'type', 'overlay'], zIndex: 1})
    
        // Converts geojson-vt data to GeoJSON
        const replacer = function (key, value) {
            if (!value || !value.geometry) {
            return value;
            }
        
            let type;
            const rawType = value.type;
            let geometry = value.geometry;
            if (rawType === 1) {
            type = 'MultiPoint';
            if (geometry.length === 1) {
                type = 'Point';
                geometry = geometry[0];
            }
            } else if (rawType === 2) {
            type = 'MultiLineString';
            if (geometry.length === 1) {
                type = 'LineString';
                geometry = geometry[0];
            }
            } else if (rawType === 3) {
            type = 'Polygon';
            if (geometry.length > 1) {
                type = 'MultiPolygon';
                geometry = [geometry];
            }
            }
        
            return {
            'type': 'Feature',
            'geometry': {
                'type': type,
                'coordinates': geometry,
            },
            'properties': value.tags,
            };
        };

        fetch(layer.geojson_link)
        .then(function (response) {
            return response.json();
        })
        .then(json => {
            const tileIndex = geojsonvt(json, {
                extent: 4096,
                maxZoom: 20,
                debug: 0,
            });
            const format = new GeoJSON({
                // Data returned from geojson-vt is in tile pixel units
                dataProjection: new Projection({
                    code: 'TILE_PIXELS',
                    units: 'tile-pixels',
                    extent: [0, 0, 4096, 4096],
                }),
            });
            const vectorSource = new VectorTileSource({
                tileUrlFunction: function (tileCoord) {
                    // Use the tile coordinate as a pseudo URL for caching purposes
                    return JSON.stringify(tileCoord);
                },
                tileLoadFunction: function (tile, url) {
                    const tileCoord = JSON.parse(url);
                    const data = tileIndex.getTile(
                        tileCoord[0],
                        tileCoord[1],
                        tileCoord[2]
                    );
                    const geojson = JSON.stringify({
                        type: 'FeatureCollection',
                        features: data ? data.features : [],
                    }, replacer);
                    const features = format.readFeatures(geojson, {
                        extent: vectorSource.getTileGrid().getTileCoordExtent(tileCoord),
                        featureProjection: map.getView().getProjection(),
                    });
                    tile.setFeatures(features);
                },
            });

            vt_layer.setSource(vectorSource);
            vt_layer.set('id', layer.id) //Define the layer as a thematic one
            vt_layer.set('type', 'Thematic') //Define the layer as a thematic one
            vt_layer.set('features', 'Thematic') //Store features as property

            //Adds thematic layer
            map.addLayer(vt_layer)

            //Adds thematic layer to plotted object
            layer.ol_layer = vt_layer
            
            //Focus the added layer
                //Convert GeoJSON Projection
            const features = new GeoJSON().readFeatures(json)
            vt_layer.set('features', features)
            const convertedJson = JSON.parse(new GeoJSON().writeFeatures(features, {
                dataProjection: 'EPSG:3857',
                featureProjection: 'EPSG:4326'
                })
            )
                //Get center of the layer
            const centerWebMercator = center(convertedJson).geometry.coordinates

                //Set the center of the view
            const tExtent = bbox(convertedJson)
            map.setView(new View({
                center: centerWebMercator,
                extent: (map_options.includes('bounds')) ? tExtent : undefined,
                zoom: 6,
                maxZoom: 20
            }))
            map.getView().fit(tExtent)
            vt_layer.set('center', centerWebMercator)
            vt_layer.set('extent', tExtent)
    
            document.body.style.cursor = "default"
    
            //Add Highlight Event and get featureOverlay
            this.highlightFeature(vt_layer)
    
        })
       
    }

    removeLayerOfMap(pLayer) {

        //Remove thematic layer, if any
        this.map.getLayers().forEach((layer) => {
            if(layer != undefined) {
                if(pLayer !== undefined && layer.get('id') === pLayer.id) {
                    this.map.removeLayer(layer)
                }
            }
        })
    }

    removeHighlight(layer_id) {
        //Remove highlightOverlay
        const highlightOverlay = getLayerById(this.map, layer_id).get('overlay')
        highlightOverlay.setStyle(null)
        
        //Remove event
		const tlEventKey = this.map.get('tlEventKeyHighlight_'+ layer_id)
		if(tlEventKey){
            this.map.un(tlEventKey.type, tlEventKey.listener)
        } 
    }

	highlightFeature(thematic_layer) {
		//Feature to highlight
		let highlight;

		//Highlight Style
		const highlightFeature = new Style({
			stroke: new Stroke({
				color: 'white',
				width: 4,
			}),
		});

		//Overlay Feature
		const featureOverlay = new VectorTileLayer({
			source: thematic_layer.getSource(),
			map: this.map,
			renderMode: 'vector',
			style: function (feature) {
				const feature_id = feature.getProperties()[feature.getKeys()[1]]
				if (feature_id === highlight) {
				  	return highlightFeature;
				}
			},
			zIndex: 1
		});

		const highlightFeatureByPixel = pixel => {

			const feature = this.map.forEachFeatureAtPixel(pixel, (feature) => feature,
			{layerFilter: (layer) => layer.get('id') === thematic_layer.get('id')});		
			
			if(feature) {
				const feature_id = feature.getProperties()[feature.getKeys()[1]]
				highlight = feature_id
                featureOverlay.changed()
			} else {
                highlight = null
                featureOverlay.changed()
            }
		}

		const handlePointerMoveHighlight = evt => {
			if (evt.dragging) {
				return;
			}
			const pixel = this.map.getEventPixel(evt.originalEvent);
			highlightFeatureByPixel(pixel);
		}

		const new_tlEventKey = this.map.on('pointermove', handlePointerMoveHighlight);

		this.map.set('tlEventKeyHighlight_' + thematic_layer.get('id'), new_tlEventKey)
        
        thematic_layer.set('overlay', featureOverlay) //Store highlight overlay layer as property
        
        return featureOverlay

	};

    updateSymbology(pLayer, symbology) {
        if(pLayer !== null && pLayer.attribute_to_symbolize !== null) {
            pLayer.mapFill.updateParameters(symbology.method, symbology.color_scheme, 
                symbology.palette, symbology.n_classes) 

            const layer = getLayerById(this.map, pLayer.id)
			layer.setStyle(function (feature) {
				const value = feature.get(pLayer.attribute_to_symbolize.attribute)
				const color = (!isNaN(value)) ? pLayer.mapFill.getColor(
                    feature.get(pLayer.attribute_to_symbolize.attribute)) : 'rgba(128, 128, 128, 0.7)';
				const style = new Style({
					fill: new Fill({
						color: color,
					})
				})
				return style;
			})

            pLayer.symbology = symbology
		}
    }

    resetSymbology(pLayer) {
        const layer = getLayerById(this.map, pLayer.id)
        layer.setStyle()
        pLayer.symbology = null
    }

    setAttributeToSimbolize(pLayer, attribute) {

        if(pLayer['attribute_to_symbolize'] != attribute) {
            pLayer['attribute_to_symbolize'] = attribute
            // const layer = getLayerById(this.map, pLayer.id)
			const features = pLayer.ol_layer.get('features')
			let attr_values = []
            if(attribute !== null) {
                features.map((feature) => {
                    attr_values.push(feature.get(attribute.attribute))
                })
            }
            pLayer.mapFill.setArrValues(attr_values) 
            // this.updateLayer(pLayer)
        }
    }

    getLayerAttributes(layer_id) {
    
        return fetch("https://geocem.centrodametropole.fflch.usp.br/api/v2/layers/" + layer_id + "/attribute_set")
        .then(response => {
            return response.json();
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            return null
        })
        .then(json => {
            return json.attributes
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            return null
        });
    }

    reorderLayers(from, to) {
        const layers = [...this.plotted]
        const [reorderedLayer] = layers.splice(from, 1);
        layers.splice(to, 0, reorderedLayer);
        this.setPlotted(layers)
        this.updateOrderOnMap()
    }

    updateOrderOnMap() {
        this.plotted.forEach((pLayer, index) => {
            const layer = getLayerById(this.map, pLayer.id)
            layer.setZIndex(index)
        })
    }

    updatePanel(pLayer, panel) {
        if(pLayer.panel != panel) {
            pLayer.panel = panel
            this.updateLayer(pLayer)
        }

        const hasComparePanel = this.plotted.some(layer => layer.panel === 1)
        const layer = getLayerById(this.map, pLayer.id)

        if(panel === 0) { //Layer deactivated compare panel
            //Remove event
            const evtPre = layer.get('prerenderEvt')
            const evtPost = layer.get('postrenderEvt')
            if(evtPre && evtPost){
                layer.un(evtPre.type, evtPre.listener)
                layer.un(evtPost.type, evtPost.listener)
            }

            //Reset canvas
            layer.once('prerender',  event => {
                const ctx = event.context;
                const mapSize = this.map.getSize();
                const width = mapSize[0];
                const tl = getRenderPixel(event, [width, 0]);
                const tr = getRenderPixel(event, [mapSize[0], 0]);
                const bl = getRenderPixel(event, [width, mapSize[1]]);
                const br = getRenderPixel(event, mapSize);
                
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(tl[0], tl[1]);
                ctx.lineTo(bl[0], bl[1]);
                ctx.lineTo(br[0], br[1]);
                ctx.lineTo(tr[0], tr[1]);
                ctx.closePath();
                ctx.clip();

            })

            layer.once('postrender', event => {
                const ctx = event.context;
                ctx.restore();
            })

            layer.changed()
            this.map.renderSync()

        } else { //Layer activated compare panel
            const dividerRange = this.dividerRange
            const prerenderEvt = layer.on('prerender',  event => {
                const ctx = event.context;
                const mapSize = this.map.getSize();
                const offset = (0.5 - this.dividerRange.current.value) * 42
                const width = mapSize[0] * (this.dividerRange.current.value) + offset;
                const tl = getRenderPixel(event, [width, 0]);
                const tr = getRenderPixel(event, [mapSize[0], 0]);
                const bl = getRenderPixel(event, [width, mapSize[1]]);
                const br = getRenderPixel(event, mapSize);
                
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(tl[0], tl[1]);
                ctx.lineTo(bl[0], bl[1]);
                ctx.lineTo(br[0], br[1]);
                ctx.lineTo(tr[0], tr[1]);
                ctx.closePath();
                ctx.clip();

            })

            const postrenderEvt =  layer.on('postrender', event => {
                const ctx = event.context;
                ctx.restore();
            })

            layer.set('prerenderEvt', prerenderEvt)
            layer.set('postrenderEvt', postrenderEvt)
        }
        
        if(!hasComparePanel) {
            this.activateSlider(0)
        } else {
            this.activateSlider(1)
        }      
    }
    
    canCompare() {
        if(this.plotted.length < 2)
            return false
        else 
            return this.plotted.some(layer => layer.panel === 1)
    }
}
