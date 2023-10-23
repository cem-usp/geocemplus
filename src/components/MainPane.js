import Map from './MapGeo'
import Header from "./Header";
import LayerList from './loadWFS' 
import Fillbar from './Fillbar' 
import { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import {filterNumberAttributes} from '../utils/UtilFunctions'

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
	const handlePaletteChange = (e,v) => {
        setPalette(v)
    }    

    const [attributeTitle, setAttributeTitle] = useState('')
    const handleAttributeTitleChange = (e) => {
		console.log('title', e.target.value)
        setAttributeTitle(e.target.value)
    }
    //Update Attribute list options when layer changes
    const [attrList, setAttrList] = useState(null)
    const [filterAttrNames, setFilterAttrNames] = useState(null)
    useEffect(() => {
		const list = (attributes) ? attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		const filtered_attributes = (attributes) ? filterNumberAttributes(attributes) : null
		const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
		
		setAttrList(list)
      	setFilterAttrNames(filtered_names)
    },[attributes])
    
    const [attributesLF, setAttributesLF] = useState([])

	const handleAttributesLFChange = (e) => {
		setAttributesLF(e.target.value);
	};


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
				attributeTitle={attributeTitle}
				onAttributeTitleChange={handleAttributeTitleChange}
				attrList={attrList}
				attributesLF={attributesLF}
				handleALFChange={handleAttributesLFChange}
            />
            <Map 
                layer_url={layer_url} 
                attributes={attributes}
                fill_attribute={fill_attribute}
                method={method}
                n_classes={n_classes}
                color_scheme={color_scheme}
                palette={palette}
				attributeTitle={attributeTitle}
				attributesLF={attributesLF}

            />
        </div>
    
    );
}

export default MainPane