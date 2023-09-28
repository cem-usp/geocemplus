import Map from './MapGeo'
import Header from "./Header";
import LayerList from './loadWFS' 
import { useState } from 'react';

function MainPane() {
	const [layer_url, setLayerURL] = useState(null);
    const [attributes, setAttributes] = useState(null)

    return (
        <div>
            <Header />
            <LayerList 
                layer_url={layer_url} changeLayerURL={setLayerURL}
                changeAttributes={setAttributes}
            />
            <Map layer_url={layer_url} attributes={attributes}/>
        </div>
    
    );
}

export default MainPane