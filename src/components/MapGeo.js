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

import 'ol/ol.css';

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


function MapGeo(props) {
	const mapElement = useRef()
	const initialMap = new Map({
		layers: [
			new TileLayer({
				source: new OSM(),
			})
		],
		view: new View({
			center: [0, 0],
			zoom: 2,
		}),
	})

	const [map, setMap] = useState(initialMap)
	const [geoJSON, setGeoJSON] = useState()

	useEffect(() => {
		map.setTarget(mapElement.current)

		var layer = null

		if (props.geoJSON !== null && geoJSON !== props.geoJSON) {
			setGeoJSON(props.geoJSON)

			// Adds layer as Vector Tile
			layer = new VectorTileLayer({properties: 'id'})

			fetch(props.geoJSON)
				.then(function (response) {
					return response.json();
				})
				.then(function (json) {
					// const centerWebMercator = center(json).geometry.coordinates
					// const tExtent = square(bbox(json))
					const tileIndex = geojsonvt(json, {
						extent: 4096,
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
						if(layer.get('id') == 'Thematic')
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
					const tExtent = bbox(convertedJson)
					map.setView(new View({
						center: centerWebMercator,
						zoom: 6
					}))
					map.getView().fit(tExtent)

				})
		}
	})

	return (
		<div>
			<div ref={mapElement} className="map-container"></div>
		</div>
	);
}

export default MapGeo