import VectorTileSource from 'ol/source/VectorTile';
import VectorTileLayer from 'ol/layer/VectorTile';
import MVT from 'ol/format/MVT';

// Calculation of tile urls for zoom levels 1, 3, 5, 7, 9, 11, 13, 15.
const t_u_func = function tileUrlFunction(tileCoord) {

  const zCoord = (tileCoord[0] >= 14) ? 14 : tileCoord[0]

  return (
    'https://tiles.mapillary.com/maps/vtp/mly1_public/2/{z}/{x}/{y}?access_token=MLY|9006973349373388|91a175c294e87cd0e18a346877811833'
  )
    .replace('{z}', String(zCoord))
    .replace('{x}', String(tileCoord[1]))
    .replace('{y}', String(tileCoord[2]))
    .replace(
      '{a-d}',
      'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
    );
}

export default function getMapillaryVT() {
    const vector_tile = new VectorTileLayer({
        source: new VectorTileSource({
          format: new MVT(),
          tileUrlFunction: t_u_func,
        }),
        zIndex: 10,
        declutter: true,
        minZoom: 6
    })

    return vector_tile
}
