import { useState } from "react";

//Array of geolayers
const [geolayers, setGeoJSON] = useState([])


function addLayer(layer_url, map) {

    //Create Vector Tile layer
    const layer = new VectorTileLayer({properties: 'id', zIndex: 1})

    //Fetch URL with GeoJSON
    fetch(layer_url)
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        //slice GeoJSON data into vector tiles
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

    //Updates GeoJSON
    if (props.layer_url !== null && geoJSON !== props.layer_url) {
        //Clear fields of attibute
        props.setFAttribute('')
        props.setAttributesLF([])
        props.setAttributeTitle('')

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
}
