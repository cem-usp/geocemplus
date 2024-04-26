import React, { useEffect, useState, useRef } from "react";
import { OSM } from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer}  from 'ol/layer';
import { View } from 'ol';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Circle, Fill, Style, Stroke, Icon } from 'ol/style';
import Control from 'ol/control/Control';
import {ScaleLine} from 'ol/control.js';
import 'ol/ol.css';

import {Fill as MapFill} from '../utils/Fill'

import Legend from '../services/Legend'
import ReactDOM from 'react-dom/client';

import MenuItem from '@mui/material/MenuItem';

import LegendAtInfo from '../services/LegendAtInfo'

import {filterNumberAttributes} from '../utils/UtilFunctions'

import {getMapillaryVT, updateMapiLayer} from '../services/mapillary/MapiLayer'

import {getLayerById} from './ol-utils/Utils'

import NavigationIcon from '@mui/icons-material/Navigation';
import Box from '@mui/material/Box';

import GeoLayers from './subcomponents/GeoLayers'

//Fill
const mapFill = new MapFill()

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

	// Scale Control
	if(!getControl(props.map, 'scale')) {
		const scaleControl = new ScaleLine({
			units: 'metric',
			properties: 'id'
	  	});
		scaleControl.set('id', 'scale')
		props.map.addControl(scaleControl)
	}

	//Add North Arrow control
	if(!getControl(props.map, 'north_arrow')) {
		const outputNA = document.createElement("div")
		const rootOutNA = ReactDOM.createRoot(outputNA)
		rootOutNA.render(
			<Box className='ol-north-arrow' position='absolute'>
				<NavigationIcon />
			</Box>)
		const naControl = new Control({element: outputNA, properties: 'id'})
		naControl.set('id', 'north_arrow')
		props.map.addControl(naControl)	
	}

	// Full Screen Control	
	props.map.addControl(props.fs_control)

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

	//Updates thematic layer
	useEffect(() => {

		props.map.setTarget(mapElement.current)
		
		props.mapGeoLayers.updateLayers()

	}, [props.checked_layers])

	//Handle Basic Options change
	useEffect(() => {
		const map_layer_osm = getLayerById(props.map, 'OSM')
		const map_layer_thematic = getLayerById(props.map, 'Thematic')
		const map_layer_icon = getLayerById(props.map, 'icon')
		const map_layer_mapillary = getLayerById(props.map, 'mapillary')

		//Base Map option
		if(props.basicOptions.includes('map') && map_layer_osm === null) {
			props.map.addLayer(layer_osm)
		} else if(!props.basicOptions.includes('map')) {
			props.map.removeLayer(map_layer_osm)
		}

		//Mapillary option
		if(props.basicOptions.includes('mapillary') && map_layer_mapillary === null) {
			props.map.addLayer(getMapillaryVT(props.map, props.mapi_viewer, props.mapilOID))
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

	//Handle mapillary OID change
	useEffect(() => {
		const mapillary_layer = getLayerById(props.map, 'mapillary')

		if(mapillary_layer !== null) {
			updateMapiLayer(mapillary_layer, props.map, props.mapi_viewer, props.mapilOID)
		}
		
	}, [props.mapilOID])

	//Handle Attribute change
	useEffect(() => {
		const thematic_layer = getLayerById(props.map, 'Thematic')
	
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
		const thematic_layer = getLayerById(props.map, 'Thematic')
		
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
		if(legendControl) props.map.removeControl(legendControl)
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