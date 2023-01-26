import React, { useEffect, useState, useRef } from "react";
import { OSM } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {Tile as TileLayer} from 'ol/layer';
import Projection from 'ol/proj/Projection';
import { Map, View } from 'ol';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Fill, Style } from 'ol/style';
import geojsonvt from 'geojson-vt';
import center from '@turf/center';
import {bbox} from '@turf/turf'
import Control from 'ol/control/Control';

import ToolbarMain from './Toolbar/ToolbarMain.js'

import 'ol/ol.css';

import {Fill as MapFill} from '../utils/Fill'

import Legend from '../services/Legend'
import ReactDOM from 'react-dom/client';

import MenuItem from '@mui/material/MenuItem';

import LegendAtInfo from '../services/LegendAtInfo'

import {filterNumberAttributes} from '../utils/UtilFunctions'

//Fill
const mapFill = new MapFill()

//Max Zoom
const max_zoom = 20

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

//Base map layer (Open Street Map)
const layer_osm = new TileLayer({
	source: new OSM(),
	maxZoom: max_zoom
})
layer_osm.set('id', 'OSM')
layer_osm.setZIndex(0)

//Function get a Layer by ID property
function getLayer(map, id) {
	let found_layer = null
	map.getLayers(map, id).forEach((layer) => {
		if(layer.get('id') === id){
			found_layer = layer
		}
	})
	return found_layer
}

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

function MapGeo(props) {
	//Toolbar Basic Options
	const [basicOptions, setBasicOptions] = useState(() => ['map']);
	const [textTitulo, setTextTitulo] = useState(() => '')
	const [attribute, setAttribute] = useState(() => '')

	const handleBasicOptionsChange = (event, newOptions) => {
		setBasicOptions(newOptions);
	};

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
        setAttributeTitle(e.target.value)
    }

	//Prevent map element to re-render	
	const mapElement = useRef()

	//Initialize map
	const initialMap = new Map({
		view: new View({
			center: [0, 0],
			zoom: 2,
			maxZoom: max_zoom,
		}),
	})

	//Title control
	const controlTitle = `
							<div class="info ol-control ol-title">
								<h4 id="ol-control-title"></h4>
							</div>
						 `

	let controlEl= document.createElement('div');
	controlEl.innerHTML= controlTitle;

	initialMap.addControl(new Control({element: controlEl}))

	//Map Variable
	const [map, setMap] = useState(initialMap)
	//GeoJSON Variable
	const [geoJSON, setGeoJSON] = useState()
	
	//Updates thematic layer
	useEffect(() => {
		map.setTarget(mapElement.current)

		var layer = null

		//Updates GeoJSON
		if (props.geoJSON !== null && geoJSON !== props.geoJSON) {
			//Clear fill attibute
			setAttribute('')

			setGeoJSON(props.geoJSON)

			// Adds layer as Vector Tile
			layer = new VectorTileLayer({properties: 'id', zIndex: 10})

			fetch(props.geoJSON)
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
								featureProjection: map.getView().getProjection(),
							});
							tile.setFeatures(features);
						},
					});

					layer.setSource(vectorSource);
					layer.set('id', 'Thematic') //Define the layer as a thematic one
					layer.set('features', 'Thematic') //Store features as property

					//Remove previous thematic layer, if any
					map.getLayers().forEach((layer) => {
						if(layer !== undefined && layer.get('id') === 'Thematic')
							map.removeLayer(layer)
					})
					//Adds thematic layer
					map.addLayer(layer)
					
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
					map.setView(new View({
						center: centerWebMercator,
						extent: (basicOptions.includes('bounds')) ? tExtent : undefined,
						zoom: 6,
						maxZoom: max_zoom
					}))
					map.getView().fit(tExtent)
					layer.set('center', centerWebMercator)
					layer.set('extent', tExtent)

					document.body.style.cursor = "default"

				})
		}
	}, [props.geoJSON])

	//Handle Basic Options change
	useEffect(() => {
		const map_layer_osm = getLayer(map, 'OSM')
		const map_layer_thematic = getLayer(map, 'Thematic')

		//Base Map option
		if(basicOptions.includes('map') && map_layer_osm === null) {
			map.addLayer(layer_osm)
		} else if(!basicOptions.includes('map')) {
			map.removeLayer(map_layer_osm)
		}

		if (map_layer_thematic !== null) {
			//Bounds option
			if(basicOptions.includes('bounds')) {
				map.setView(new View({
					center: map_layer_thematic.get('center'),
					extent: map_layer_thematic.get('extent'),
					zoom: 6,
					maxZoom: max_zoom
				}))
			} else{
				map.setView(new View({
					center: map_layer_thematic.get('center'),
					zoom: 6,
					maxZoom: max_zoom
				}))
				map.getView().fit(map_layer_thematic.get('extent'))
			}

		}
	}, [basicOptions])

	//Handle title change
	useEffect(() => {
		const infoEl = document.getElementById('ol-control-title')
		infoEl.innerHTML = textTitulo
	}, [textTitulo])

	//Handle Attribute change
	useEffect(() => {
		const thematic_layer = getLayer(map, 'Thematic')
	
		if(thematic_layer !== null && attribute !== '') {
			const thematic_source = thematic_layer.getSource()
			const features = thematic_layer.get('features')
			let attr_values = []
			
			features.map((feature) => {
				attr_values.push(feature.get(attribute))
			})

			mapFill.updateParameters(attr_values, null, color_scheme, palette, n_classes) 
			
			thematic_layer.setStyle(function (feature) {
				const value = feature.get(attribute)
				const color = (!isNaN(value)) ? mapFill.getColor(feature.get(attribute)) : 'rgba(128, 128, 128, 0.7)';
				const style = new Style({
					fill: new Fill({
						color: color,
					})
				})
				return style;
			})

			updateLegend()
		} else if (attribute === '' && thematic_layer !== null) { //Reset thematic map
			thematic_layer.setStyle()
			removeLegend()
		}

	}, [attribute])

	//Handle Fill changes
	useEffect(() => {
		const thematic_layer = getLayer(map, 'Thematic')
		
		if(thematic_layer !== null && attribute !== '') {
			mapFill.updateParameters(null, method, color_scheme, palette, n_classes) 
			
			thematic_layer.setStyle(function (feature) {
				const value = feature.get(attribute)
				const color = (!isNaN(value)) ? mapFill.getColor(feature.get(attribute)) : 'rgba(128, 128, 128, 0.7)';
				const style = new Style({
					fill: new Fill({
						color: color,
					})
				})
				return style;
			})

			updateLegend()
		}
	},[method, n_classes, color_scheme, palette])

	//Update Attributes legend tooltip
	useEffect(() => {
		updateTooltipLegend(attributesTT, attributeTitle)
	}, [attributesTT, attributeTitle])

	//Update Attribute list options when layer changes
    const [attrNames, setAtrNames] = useState(null)
    const [filterAttrNames, setFilterAttrNames] = useState(null)
    useEffect(() => {
		const names = (props.attributes) ? props.attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		const filtered_attributes = (props.attributes) ? filterNumberAttributes(props.attributes) : null
		const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
      setAtrNames(names)
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
		map.addControl(lControl)	
	}

	function removeLegend() {
		const legendControl = getControl(map, 'legend')
		if(legendControl) {
			map.removeControl(legendControl)
		}
	}

	//Add Tooltip Legend control
	function updateTooltipLegend(attributes_tt, attribute_title) {

		//Remove legenda
		const legendControl = getControl(map, 'tooltip-legend')
		if(legendControl) map.removeControl(legendControl)

		//Remove evento
		const tlEventKey = map.get('tlEventKey')
		if(tlEventKey) map.un(tlEventKey.type, tlEventKey.listener)

		//Se não há atributos selecionados, para a execução
		if(attributesTT.length === 0 && attributeTitle === '') return
		
		const output = document.createElement("div")
		const rootOut = ReactDOM.createRoot(output)
		rootOut.render(<LegendAtInfo title={attributeTitle} attributes={attributesTT}/>)
		const LegendAt = new Control({element: output, properties: 'id'})
		LegendAt.set('id', 'tooltip-legend')
		map.addControl(LegendAt)

		//Update function to get the attributes
		const displayFeatureInfo = function (pixel) {
			const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
			  return feature;
			});

			const info_title = document.getElementById('attributeTitle_infomap');
		  
			if (feature) {
				if(info_title && attributeTitle !== '')
					info_title.innerHTML = feature.get(attributeTitle.attribute)
				
				attributesTT.map((attribute) => {
					const info = document.getElementById('infomap_' + attribute.attribute);
					if(!feature.get(attribute.attribute))
						info.innerHTML = '&nbsp;'
					else
						info.innerHTML = (isNaN(feature.get(attribute.attribute))) ? feature.get(attribute.attribute) : feature.get(attribute.attribute).toLocaleString("pt-BR", {maximumFractionDigits: 4})
				})

			} else {
				if(info_title)
					info_title.innerHTML = '&nbsp;'
				
				attributesTT.map((attribute) => {
					const info = document.getElementById('infomap_' + attribute.attribute);
					info.innerHTML = '&nbsp;';
				})
			}

			// if (feature !== highlight) {
			//   if (highlight) {
			// 	featureOverlay.getSource().removeFeature(highlight);
			//   }
			//   if (feature) {
			// 	featureOverlay.getSource().addFeature(feature);
			//   }
			//   highlight = feature;
			// }
		};

		const teste = function (evt) {
			if (evt.dragging) {
				return;
			}
			const pixel = map.getEventPixel(evt.originalEvent);
			displayFeatureInfo(pixel);
		}

		const new_tlEventKey = map.on('pointermove', teste);

		map.set('tlEventKey', new_tlEventKey)
	}	
	return (
		<div>
			<ToolbarMain 
				// ToolbarBasic
				basicOptions={basicOptions}
				onBasicOptionsChange={handleBasicOptionsChange}
				titulo={textTitulo}
				onTituloChange={handleTituloChange}
				attributes={props.attributes}
				attrNames={attrNames}
				filterAttrNames={filterAttrNames}
				attribute={attribute}
				onAttributeChange={handleAttributeChange}
				map={map}
				// ToolbarFill
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

			/>
			<div ref={mapElement} className="map-container">
			</div>
		</div>
	);
}

export default MapGeo