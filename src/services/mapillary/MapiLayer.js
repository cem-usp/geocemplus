import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import MVT from 'ol/format/MVT';
import { Style, Stroke } from 'ol/style';

export default function getMapillaryVT(map, mapi_viewer) {
    const mapillary_layer = new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          url: 'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9006973349373388|91a175c294e87cd0e18a346877811833',
          maxZoom: 14
        }),
        zIndex: 4,
        declutter: true,
        properties: {'id': 'mapillary'}
    })

    showSLIPreview(mapillary_layer, map, mapi_viewer)
    
    return mapillary_layer
}


function showSLIPreview(mapillary_layer, map, mapi_viewer) {

  //Feature to highlight
  let highlight;

  //Remove evento
  const tlEventKey = map.get('tlEventKeyHighlightMapillary')
  if(tlEventKey) map.un(tlEventKey.type, tlEventKey.listener)

  //Highlight Style
  const highlightFeature = new Style({
    stroke: new Stroke({
      color: 'white',
      width: 4,
    }),
  });

  //Overlay Feature
  const featureOverlay = new VectorTileLayer({
    source: mapillary_layer.getSource(),
    map: map,
    renderMode: 'vector',
    style: function (feature) {
      if (feature.getId() === highlight) {
          return highlightFeature;
      }
    },
    zIndex: 5
  });

  const displayFeatureInfo = function (pixel) {

    const feature = map.forEachFeatureAtPixel(pixel, function (feature) {
      if(feature.getType() == 'Point' && feature.get('id') !== null) {
			  mapi_viewer.moveTo(feature.get('id'))
      }

      return feature.getId();
    });		

    highlight = feature
    //featureOverlay.changed()
  }

  const handlePointerMoveHighlight = function (evt) {
    if (evt.dragging) {
      return;
    }
    const pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel);
  }

  const new_tlEventKey = map.on('click', handlePointerMoveHighlight);

  map.set('tlEventKeyHighlightMapillary', new_tlEventKey)

};
