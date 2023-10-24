import React, { useEffect, useState, useRef } from "react";
import { OSM } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {Tile as TileLayer, Vector as VectorLayer}  from 'ol/layer';
import Projection from 'ol/proj/Projection';
import { Map, View } from 'ol';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Fill, Style, Stroke, Icon } from 'ol/style';
import geojsonvt from 'geojson-vt';
import center from '@turf/center';
import {bbox} from '@turf/turf'
import Control from 'ol/control/Control';

import ToolbarFill from './Toolbar/ToolbarFill'
import ToolbarBasic from './Toolbar/ToolbarBasic'

import 'ol/ol.css';

import {Fill as MapFill} from '../utils/Fill'

import Legend from '../services/Legend'
import ReactDOM from 'react-dom/client';

import MenuItem from '@mui/material/MenuItem';

import LegendAtInfo from '../services/LegendAtInfo'

import {filterNumberAttributes} from '../utils/UtilFunctions'

import MapiLayer from '../services/mapillary/MapiLayer'

import {getLayer} from './ol-utils/Utils'

//Fill
const mapFill = new MapFill()

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

function MapGeo(props) {

	//Base map layer (Open Street Map)
	const layer_osm = new TileLayer({
		source: new OSM(),
		maxZoom: props.max_zoom,
		zIndex: 0
	})
	layer_osm.set('id', 'OSM')

	//Function get a Control by ID property
	function getControl(map, id) {
		let found_control = null
		map.getControls(map, id).forEach((control) => {
			if(control.get('id') === id){
				found_control = control
			}
		})
		return found_control
	}

	//Toolbar Basic Options
	//const [basicOptions, setBasicOptions] = useState(() => ['map']);
	const [textTitulo, setTextTitulo] = useState(() => '')
	const [attribute, setAttribute] = useState(null)

	// const handleBasicOptionsChange = (event, newOptions) => {
	// 	setBasicOptions(newOptions);
	// };

	const handleTituloChange = (event) => {
		setTextTitulo(event.target.value);
	};

	const handleAttributeChange = (event) => {
		setAttribute(event.target.value);
	};

	//Toolbar Fill
    const [n_classes, setNClasses] = useState(5)
    const [color_scheme, setColorScheme] = useState('sequential')

    const handleNClassesChange = (e) => {
        setNClasses(e.target.value)
    }

    const handleColorSchemeChange = (e) => {
		setColorScheme(e.target.value);
	};

	const handlePaletteChange = (e) => {
        setPalette(e.target.value)
    }    
    const [palette, setPalette] = useState('')

	const handleMethodChange = (e) => {
        setMethod(e.target.value)
    }
    const [method, setMethod] = useState('quantile')

    const [attributesTT, setAttributesTT] = useState([])

	const handleAttributesTTChange = (e) => {
		setAttributesTT(e.target.value);
	};

    const [attributeTitle, setAttributeTitle] = useState('')

    const handleAttributeTitleChange = (e) => {
		console.log('title', e.target.value)
        setAttributeTitle(e.target.value)
    }

	//Prevent map element to re-render	
	const mapElement = useRef()

	//Title control
	const controlTitle = `
							<div class="info ol-control ol-title">
								<h4 id="ol-control-title"></h4>
							</div>
						 `

	let controlEl= document.createElement('div');
	controlEl.innerHTML= controlTitle;

	//GeoJSON Variable
	const [geoJSON, setGeoJSON] = useState()
	
	//Updates thematic layer
	useEffect(() => {
		props.map.setTarget(mapElement.current)

		var layer = null

		//Updates GeoJSON
		if (props.layer_url !== null && geoJSON !== props.layer_url) {
			//Clear fields of attibute
			setAttribute(null)
			setAttributesTT([])
			setAttributeTitle('')

			setGeoJSON(props.layer_url)

			// Adds layer as Vector Tile
			layer = new VectorTileLayer({properties: 'id', zIndex: 1})

			fetch(props.layer_url)
				.then(function (response) {
					return response.json();
				})
				.then(function (json) {
					// const centerWebMercator = center(json).geometry.coordinates
					// const tExtent = square(bbox(json))
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
								featureProjection: props.map.getView().getProjection(),
							});
							tile.setFeatures(features);
						},
					});

					layer.setSource(vectorSource);
					layer.set('id', 'Thematic') //Define the layer as a thematic one
					layer.set('features', 'Thematic') //Store features as property

					//Remove previous thematic layer, if any
					props.map.getLayers().forEach((layer) => {
						if(layer !== undefined && layer.get('id') === 'Thematic')
						props.map.removeLayer(layer)
					})
					//Adds thematic layer
					props.map.addLayer(layer)
					
					//Focus the added layer
						//Convert GeoJSON Projection
					const features = new GeoJSON().readFeatures(json)
					layer.set('features', features)
					const convertedJson = JSON.parse(new GeoJSON().writeFeatures(features, {
						dataProjection: 'EPSG:3857',
						featureProjection: 'EPSG:4326'
						})
					)
						//Get center of the layer
					const centerWebMercator = center(convertedJson).geometry.coordinates

					//Set the center of the view
					const tExtent = bbox(convertedJson)
					props.map.setView(new View({
						center: centerWebMercator,
						extent: (props.basicOptions.includes('bounds')) ? tExtent : undefined,
						zoom: 6,
						maxZoom: props.max_zoom
					}))
					props.map.getView().fit(tExtent)
					layer.set('center', centerWebMercator)
					layer.set('extent', tExtent)

					document.body.style.cursor = "default"

					//Add Highlight Event 
					highlightFeature()

				})
		}
	}, [props.layer_url])

	//Handle Basic Options change
	useEffect(() => {
		const map_layer_osm = getLayer(props.map, 'OSM')
		const map_layer_thematic = getLayer(props.map, 'Thematic')
		const map_layer_icon = getLayer(props.map, 'icon')
		const map_layer_mapillary = getLayer(props.map, 'mapillary')

		//Base Map option
		if(props.basicOptions.includes('map') && map_layer_osm === null) {
			props.map.addLayer(layer_osm)
		} else if(!props.basicOptions.includes('map')) {
			props.map.removeLayer(map_layer_osm)
		}

		//Mapillary option
		if(props.basicOptions.includes('mapillary') && map_layer_mapillary === null) {
			props.map.addLayer(MapiLayer(props.map, props.mapi_viewer))
		} else if(!props.basicOptions.includes('mapillary')) {
			props.map.removeLayer(map_layer_mapillary)
		}

		if (map_layer_thematic !== null) {
			//Bounds option
			if(props.basicOptions.includes('bounds')) {
				props.map.setView(new View({
					center: map_layer_thematic.get('center'),
					extent: map_layer_thematic.get('extent'),
					zoom: 6,
					maxZoom: props.max_zoom
				}))
			} else{
				props.map.setView(new View({
					center: map_layer_thematic.get('center'),
					zoom: 6,
					maxZoom: props.max_zoom
				}))
				props.map.getView().fit(map_layer_thematic.get('extent'))
			}

		}
	}, [props.basicOptions])

	//Handle title change
	// useEffect(() => {
	// 	const infoEl = document.getElementById('ol-control-title')
	// 	infoEl.innerHTML = textTitulo
	// }, [textTitulo])

	//Handle Attribute change
	useEffect(() => {
		const thematic_layer = getLayer(props.map, 'Thematic')
	
		if(thematic_layer !== null && props.fill_attribute !== null) {
			const thematic_source = thematic_layer.getSource()
			const features = thematic_layer.get('features')
			let attr_values = []
			features.map((feature) => {
				attr_values.push(feature.get(props.fill_attribute.attribute))
			})

			mapFill.updateParameters(attr_values, null, props.color_scheme, props.palette, props.n_classes) 
			
			thematic_layer.setStyle(function (feature) {
				const value = feature.get(props.fill_attribute.attribute)
				const color = (!isNaN(value)) ? mapFill.getColor(feature.get(props.fill_attribute.attribute)) : 'rgba(128, 128, 128, 0.7)';
				const style = new Style({
					fill: new Fill({
						color: color,
					})
				})
				return style;
			})

			updateLegend()
		} else if (props.fill_attribute === null && thematic_layer !== null) { //Reset thematic map
			thematic_layer.setStyle()
			removeLegend()
		}

	}, [props.fill_attribute])

	//Handle Fill changes
	useEffect(() => {
		const thematic_layer = getLayer(props.map, 'Thematic')
		
		if(thematic_layer !== null && props.fill_attribute !== '') {

			mapFill.updateParameters(null, props.method, props.color_scheme, props.palette, props.n_classes) 
			
			thematic_layer.setStyle(function (feature) {
				const value = feature.get(props.fill_attribute.attribute)
				const color = (!isNaN(value)) ? mapFill.getColor(feature.get(props.fill_attribute.attribute)) : 'rgba(128, 128, 128, 0.7)';
				const style = new Style({
					fill: new Fill({
						color: color,
					})
				})
				return style;
			})

			updateLegend()
		}
	},[props.method, props.n_classes, props.color_scheme, props.palette])

	//Update Attributes legend tooltip
	useEffect(() => {
		updateTooltipLegend(props.attributesLF, props.attributeTitle)
	}, [props.attributesLF, props.attributeTitle])

	//Update Attribute list options when layer changes
    const [attrList, setAttrList] = useState(null)
    const [filterAttrNames, setFilterAttrNames] = useState(null)
    useEffect(() => {
		const list = (props.attributes) ? props.attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		const filtered_attributes = (props.attributes) ? filterNumberAttributes(props.attributes) : null
		const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
		
		setAttrList(list)
      	setFilterAttrNames(filtered_names)
    },[props.attributes])
	

	function updateLegend() {
		//remove Legend control
		removeLegend()

		//Add Legend control
		const output = document.createElement("div")
		const rootOut = ReactDOM.createRoot(output)
		rootOut.render(<Legend fill={mapFill}/>)
		const lControl = new Control({element: output, properties: 'id'})
		lControl.set('id', 'legend')
		props.map.addControl(lControl)	
	}

	function removeLegend() {
		const legendControl = getControl(props.map, 'legend')
		if(legendControl) {
			props.map.removeControl(legendControl)
		}
	}

	//Add Tooltip Legend control
	function updateTooltipLegend(attributes_tt, attribute_title) {

		//Remove legenda
		const legendControl = getControl(props.map, 'tooltip-legend')
		if(legendControl) props.map.removeControl(legendControl)

		//Remove evento
		const tlEventKey = props.map.get('tlEventKey')
		if(tlEventKey) props.map.un(tlEventKey.type, tlEventKey.listener)

		//Se não há atributos selecionados, para a execução
		if(props.attributesLF.length === 0 && props.attributeTitle === '') return
		
		const output = document.createElement("div")
		const rootOut = ReactDOM.createRoot(output)
		rootOut.render(<LegendAtInfo title={props.attributeTitle} attributes={props.attributesLF}/>)
		const LegendAt = new Control({element: output, properties: 'id'})
		LegendAt.set('id', 'tooltip-legend')
		props.map.addControl(LegendAt)

		//Update function to get the attributes
		const displayFeatureInfo = function (pixel) {

			const feature = props.map.forEachFeatureAtPixel(pixel, function (feature) {
			  return feature;
			});

			const info_title = document.getElementById('attributeTitle_infomap');
		  
			if (feature) {
				if(info_title && props.attributeTitle !== '')
					info_title.innerHTML = feature.get(props.attributeTitle.attribute)
				
					props.attributesLF.map((attribute) => {
					const info = document.getElementById('infomap_' + attribute.attribute);
					if(!feature.get(attribute.attribute))
						info.innerHTML = '&nbsp;'
					else
						info.innerHTML = (isNaN(feature.get(attribute.attribute))) ? feature.get(attribute.attribute) : feature.get(attribute.attribute).toLocaleString("pt-BR", {maximumFractionDigits: 4})
				})

			} else {
				if(info_title)
					info_title.innerHTML = '&nbsp;'
				
					props.attributesLF.map((attribute) => {
					const info = document.getElementById('infomap_' + attribute.attribute);
					info.innerHTML = '&nbsp;';
				})
			}
		}

		const handlePointerMoveLegend = function (evt) {
			if (evt.dragging) {
				return;
			}
			const pixel = props.map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		}

		const new_tlEventKey = props.map.on('pointermove', handlePointerMoveLegend);

		props.map.set('tlEventKey', new_tlEventKey)

	}

	function highlightFeature() {

		//Feature to highlight
		let highlight;

		//Remove evento
		const tlEventKey = props.map.get('tlEventKeyHighlight')
		if(tlEventKey) props.map.un(tlEventKey.type, tlEventKey.listener)

		//Get Thematic Layer
		const thematic_layer = getLayer(props.map, 'Thematic')

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
			map: props.map,
			renderMode: 'vector',
			style: function (feature) {
				if (feature.get('fid') === highlight) {
				  	return highlightFeature;
				}
			},
			zIndex: 1
		  });

		const displayFeatureInfo = function (pixel) {

			const feature = props.map.forEachFeatureAtPixel(pixel, function (feature) {
				return feature.get('fid');
			});		

			highlight = feature
			featureOverlay.changed()
		}

		const handlePointerMoveHighlight = function (evt) {
			if (evt.dragging) {
				return;
			}
			const pixel = props.map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		}

		const new_tlEventKey = props.map.on('pointermove', handlePointerMoveHighlight);

		props.map.set('tlEventKeyHighlight', new_tlEventKey)

	};

	return (
		<div name='map_geral'>
			<div ref={mapElement} className="map-container position-fixed" name='map_cart'/>
{/* 

			<ToolbarBasic 
				mt="388px"
				basicOptions={basicOptions}
				onBasicOptionsChange={handleBasicOptionsChange}
				titulo={textTitulo}
				onTituloChange={handleTituloChange}
				attributes={props.attributes}
				attrList={attrList}
				filterAttrNames={filterAttrNames}
				attribute={attribute}
				onAttributeChange={handleAttributeChange}
				map={props.map}
			/>
			<ToolbarFill 
				mt="484.8px"
				n_classes={n_classes}
				handleNClassesChange={handleNClassesChange}
				color_scheme={color_scheme}
				handleColorSchemeChange={handleColorSchemeChange}
				palette={palette}
				handlePaletteChange={handlePaletteChange}
				setPalette={setPalette}
				method={method}
				handleMethodChange={handleMethodChange}
				attributesTT={attributesTT}
				handleATTChange={handleAttributesTTChange}
				attributeTitle={attributeTitle}
				onAttributeTitleChange={handleAttributeTitleChange}
				attrList={attrList}
				attributes={props.attributes}
				/> */}
		</div>
	);
}

export default MapGeo