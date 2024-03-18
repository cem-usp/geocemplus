import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import MVT from 'ol/format/MVT';
import {Circle, Fill, Stroke, Style} from 'ol/style';

const fill = new Fill({
  color: 'rgba(255,255,255,0.4)',
});
const stroke = new Stroke({
  color: '#3399CC',
  width: 1.25,
});
const styles = [
  new Style({
    image: new Circle({
      fill: fill,
      stroke: stroke,
      radius: 5,
    }),
    fill: fill,
    stroke: stroke,
  }),
];

export function getMapillaryVT(map, mapi_viewer, moid) {
    const mapillary_layer = new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          url: 'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9006973349373388|91a175c294e87cd0e18a346877811833',
          maxZoom: 14
        }),
        zIndex: 4,
        declutter: true,
        properties: {'id': 'mapillary'},
        style: function (feature) {
          if(moid !== '' && feature.properties_.organization_id != moid) {
            return null
          } else {
            return styles
          }
        }
    })

    showSLIPreview(mapillary_layer, map, mapi_viewer)
    highlightFeature(mapillary_layer, map, mapi_viewer)
    
    return mapillary_layer
}

export function updateMapiLayer(mapillary_layer, map, mapi_viewer, mapilOID) {

  mapillary_layer.setStyle(function (feature) {
    if(mapilOID !== '' && feature.properties_.organization_id != mapilOID) {
      return null
    } else {
      return styles
    }
  })

  showSLIPreview(mapillary_layer, map, mapi_viewer)
  highlightFeature(mapillary_layer, map, mapi_viewer)

}

function highlightFeature(mapillary_layer, map, mapi_viewer) {

  //Feature to highlight
  let highlight;

  //Remove evento
  const tlEventKey = map.get('tlEventKeyHighlightMapillary')
  if(tlEventKey) map.un(tlEventKey.type, tlEventKey.listener)

  //Highlight Style
  const fillHighlight = new Fill({
    color: 'rgba(255,255,255,1)',
  });
  const strokeHighlight = new Stroke({
    color: '#003475',
    width: 10.25,
  });
  const highlightStyles = [
    new Style({
      image: new Circle({
        fill: fill,
        stroke: stroke,
        radius: 10,
      }),
      fill: fillHighlight,
      stroke: strokeHighlight,
    }),
  ];

  //Overlay Feature
  const featureOverlay = new VectorTileLayer({
    source: mapillary_layer.getSource(),
    map: map,
    renderMode: 'vector',
    style: function (feature) {
			const feature_id = feature.getProperties()[feature.getKeys()[1]]
      if (feature_id === highlight) {
          return highlightStyles;
      }
    },
    zIndex: 5
  });

  const highlightFeatureByPixel = function (pixel) {

    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
			const feature_id = feature.getProperties()[feature.getKeys()[1]]
      return feature_id;
    });		
    
    highlight = feature
    featureOverlay.changed()
  }

  const handlePointerMoveHighlight = function (evt) {
    if (evt.dragging) {
      return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    highlightFeatureByPixel(pixel);
  }

  const new_tlEventKey = map.on('pointermove', handlePointerMoveHighlight);

  map.set('tlEventKeyHighlightMapillary', new_tlEventKey)
}


function showSLIPreview(mapillary_layer, map, mapi_viewer) {

  //Remove evento
  const tlEventKey = map.get('tlEventKeyClickMapillary')
  if(tlEventKey) map.un(tlEventKey.type, tlEventKey.listener)

  const viewImage = function (pixel) {

    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
			const feature_id = feature.getProperties()[feature.getKeys()[1]]
      if(feature_id !== null) {
        const image_id = (feature.getType() == 'Point') ? feature_id : feature.properties_.image_id
			  mapi_viewer.moveTo(image_id)
      }

      return feature.getId();
    });		
  }

  const handleClick = function (evt) {
    if (evt.dragging) {
      return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    viewImage(pixel);
  }

  const click_tlEventKey = map.on('click', handleClick);

  map.set('tlEventKeyClickMapillary', click_tlEventKey)

};
