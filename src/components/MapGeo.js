import React, { useEffect, useState, useRef } from "react";
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import Projection from 'ol/proj/Projection';
import { Map, View } from 'ol';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Fill, Stroke, Style } from 'ol/style';
import geojsonvt from 'geojson-vt';
import center from '@turf/center';
import {points,square,bbox} from '@turf/turf'
import {fromLonLat} from 'ol/proj';

import Toolbar from './Toolbar.js'

import 'ol/ol.css';

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
	  if (geometry.length == 1) {
		type = 'Point';
		geometry = geometry[0];
	  }
	} else if (rawType === 2) {
	  type = 'MultiLineString';
	  if (geometry.length == 1) {
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

const layer_osm = new TileLayer({
	source: new OSM(),
	maxZoom: max_zoom
})
layer_osm.set('id', 'OSM')
layer_osm.setZIndex(0)


//Remove Layer from map
function removeLayer(map, id) {
	const layer = getLayer(map, id)
	map.removeLayer(layer)
}

//Get Layer
function getLayer(map, id) {
	let found_layer = null
	map.getLayers(map, id).forEach((layer) => {
		if(layer.get('id') == id){
			found_layer = layer
		}
	})
	return found_layer
}

function MapGeo(props) {
	const [basicOptions, setBasicOptions] = useState(() => ['map']);

	const handleBasicOptionsChange = (event, newOptions) => {
		setBasicOptions(newOptions);
	};

	const mapElement = useRef()

	const initialMap = new Map({
		view: new View({
			center: [0, 0],
			zoom: 2,
			maxZoom: max_zoom,
		}),
	})

	const [map, setMap] = useState(initialMap)
	const [geoJSON, setGeoJSON] = useState()

	var tExtent = null

	//Atualiza layer temático
	useEffect(() => {
		map.setTarget(mapElement.current)

		var layer = null

		if (props.geoJSON !== null && geoJSON !== props.geoJSON) {
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
					layer.set('id', 'Thematic')

					//Remove layer
					map.getLayers().forEach((layer) => {
						if(layer !== undefined && layer.get('id') == 'Thematic')
							map.removeLayer(layer)
					})
					
					map.addLayer(layer)
					
					// //Focus the added layer
					const features = new GeoJSON().readFeatures(json)
					const convertedJson = JSON.parse(new GeoJSON().writeFeatures(features, {
						dataProjection: 'EPSG:3857',
						featureProjection: 'EPSG:4326'
						})
					)
					
					const centerWebMercator = center(convertedJson).geometry.coordinates
					tExtent = bbox(convertedJson)
					map.setView(new View({
						center: centerWebMercator,
						extent: (basicOptions.includes('bounds')) ? tExtent : undefined,
						zoom: 6,
						maxZoom: max_zoom
					}))
					map.getView().fit(tExtent)
					layer.set('center', centerWebMercator)
					layer.set('extent', tExtent)

				})
		}
	}, [props.geoJSON])

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

	return (
		<div>
			<Toolbar 
				basicOptions={basicOptions}
				onBasicOptionsChange={handleBasicOptionsChange}
			/>
			<div ref={mapElement} className="map-container"></div>
		</div>
	);
}

export default MapGeo