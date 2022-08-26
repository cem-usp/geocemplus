import React, { useEffect, useState, useRef } from "react";
import { OSM, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import Projection from 'ol/proj/Projection';
import { Map, View } from 'ol';
import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import { Fill, Stroke, Style } from 'ol/style';
import geojsonvt from 'geojson-vt';
import center from '@turf/center';

import 'ol/ol.css';

const styles = [

];

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

	useEffect(() => {
		map.setTarget(mapElement.current)

		if (props.geoJSON !== null) {
			
			const style = new Style({
				fill: new Fill({
				  color: '#eeeeee',
				}),
			  });
			const layer = new VectorTileLayer({
				background: '#1a2b39',
				style: function (feature) {
					const color = feature.get('COLOR') || '#eeeeee';
					style.getFill().setColor(color);
					return style;
				},
			});

			fetch(props.geoJSON)
				.then(function (response) {
					return response.json();
				})
				.then(function (json) {
					const featureCenter = center(json)
					const tileIndex = geojsonvt(json, {
						extent: 4096,
						debug: 1,
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
					map.addLayer(layer)
					console.log(featureCenter.geometry.coordinates)
					map.setView(new View({
						center: featureCenter.geometry.coordinates,
						zoom: 2,
					}))
					console.log('adicionou')
				})
		};
	})

	return (
		<div>
			<div ref={mapElement} className="map-container"></div>
		</div>
	);
}

export default MapGeo