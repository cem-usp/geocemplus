//Function get a Layer by ID property
export function getLayerById(map, id) {
	let found_layer = null
	map.getLayers(map, id).forEach((layer) => {
		if(layer.get('id') === id){
			found_layer = layer
		}
	})
	return found_layer
}

export function getLayersByType(map, type) {
	let found_layers = []
	map.getLayers(map, type).forEach((layer) => {
		if(layer.get('type') === type){
			found_layers.push(layer)
		}
	})
	return found_layers
}

//Function get a Control by ID property
export function getControl(map, id) {
	let found_control = null
	map.getControls(map, id).forEach((control) => {
		if(control.get('id') === id){
			found_control = control
		}
	})
	return found_control
}