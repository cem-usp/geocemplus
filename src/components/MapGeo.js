import React, { useEffect, useState, useRef } from "react";
import OSM from 'ol/source/OSM';
import TileLayer  from 'ol/layer/WebGLTile';
import { View } from 'ol';
import Control from 'ol/control/Control';
import {ScaleLine} from 'ol/control.js';
import 'ol/ol.css';
import {Fill as MapFill} from '../utils/Fill'
import ReactDOM from 'react-dom/client';
import {getMapillaryVT, updateMapiLayer} from '../services/mapillary/MapiLayer'
import {getLayerById} from './ol-utils/Utils'
import NavigationIcon from '@mui/icons-material/Navigation';
import Box from '@mui/material/Box';

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
		
	}, [props.plotted_layers])

	//Handle Basic Options change
	useEffect(() => {
		const map_layer_osm = getLayerById(props.map, 'OSM')
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

	}, [props.basicOptions])

	//Handle mapillary OID change
	useEffect(() => {
		const mapillary_layer = getLayerById(props.map, 'mapillary')

		if(mapillary_layer !== null) {
			updateMapiLayer(mapillary_layer, props.map, props.mapi_viewer, props.mapilOID)
		}
		
	}, [props.mapilOID])

	return (
		<div name='map_geral'>
			<div ref={mapElement} className="map-container position-fixed" name='map_cart'/>
		</div>
	);
}

export default MapGeo