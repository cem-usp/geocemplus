//Function get a Layer by ID property
export function getLayer(map, id) {
	let found_layer = null
	map.getLayers(map, id).forEach((layer) => {
		if(layer.get('id') === id){
			found_layer = layer
		}
	})
	return found_layer
}