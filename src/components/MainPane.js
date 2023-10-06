import Map from './MapGeo'
import Header from "./Header";
import LayerList from './loadWFS' 
import Fillbar from './Fillbar' 
import { useState } from 'react';

function MainPane() {
	const [layer_url, setLayerURL] = useState(null);
    const [attributes, setAttributes] = useState(null)
    
    // Fill parameters state
	const [fill_attribute, setFAttribute] = useState('')
    const handleFAttributeChange = (event) => {
		setFAttribute(event.target.value);
	};
    const [method, setMethod] = useState('quantile')
    const handleMethodChange = (e) => {
        setMethod(e.target.value)
    }
    const [n_classes, setNClasses] = useState(5)
    const handleNClassesChange = (e) => {
        setNClasses(e.target.value)
    }
    const [color_scheme, setColorScheme] = useState('sequential')
    const handleColorSchemeChange = (e) => {
		setColorScheme(e.target.value);
	};
    const [palette, setPalette] = useState('')
	const handlePaletteChange = (e) => {
        setPalette(e.target.value)
    }    

    return (
        <div>
            <Header />
            <LayerList 
                layer_url={layer_url} changeLayerURL={setLayerURL}
                changeAttributes={setAttributes}
            />
            <Fillbar 
                attributes={attributes}
                fill_attribute={fill_attribute}
                changeFAttribute={handleFAttributeChange}
                method={method}
                changeMethod={handleMethodChange}
                n_classes={n_classes}
                changeNClasses={handleNClassesChange}
                color_scheme={color_scheme}
                changeCScheme={handleColorSchemeChange}
                palette={palette}
                setPalette={setPalette}
                changePallete={handlePaletteChange}
            />
            <Map layer_url={layer_url} attributes={attributes}/>
        </div>
    
    );
}

export default MainPane