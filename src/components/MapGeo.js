import React, { useEffect, useState, useRef } from "react";
import {OSM, Vector as VectorSource} from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import TileLayer from 'ol/layer/Tile';
import { Map, View } from 'ol';
import {Vector as VectorLayer} from 'ol/layer';
import {Fill, Stroke, Style} from 'ol/style';

import 'ol/ol.css';

const styles = [
	
  ];

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
		
		if(props.geoJSON !== null) {
			const vectorSource = new VectorSource({
				// features: new GeoJSON().readFeatures(props.geoJSON),
				format: new GeoJSON(),
        		url: props.geoJSON,
			});
			const vectorLayer = new VectorLayer({
				source: vectorSource,
				// style: styles,
			});
			map.addLayer(vectorLayer)
			console.log('adicionou')
		}
	});

    return (
        <div>
			<div ref={mapElement} className="map-container"></div>
		</div>
    );
}

export default MapGeo