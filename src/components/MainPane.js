import Box from '@mui/material/Box';
import MapGeo from './MapGeo'
import Header from "./Header";
import LayerList from './loadWFS' 
import Fillbar from './Fillbar' 
import BottomBar from './BottomBar' 
import { useState, useEffect, useRef } from 'react';
import MenuItem from '@mui/material/MenuItem';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import { Map, View } from 'ol';
import {FullScreen} from 'ol/control.js';
import { Grid } from '@mui/material';
import MapillaryViewer from './Mapillary'
import Slider from './subcomponents/Slider.js';
import '../side-by-side.css';

function MainPane() {
    const [layer_url, setLayerURL] = useState(null);
    const [attributes, setAttributes] = useState(null)
    
    const [openBars, setOpenBars] = useState('flex');
    const handleOpenBars = () => {
        setOpenBars(!openBars)
    }
    
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

	const [basicOptions, setBasicOptions] = useState(() => ['map']);
    const handleBasicOptionsChange = (event, option) => {
        let arr = [...basicOptions]
        const teste = basicOptions.indexOf(option)

        if(teste > -1) arr.splice(teste, 1)
        else arr = arr.concat(option)

        setBasicOptions(arr)
	};

    //OL Map
    //Max Zoom
    const max_zoom = 20
	//Initialize map
    const [fs_control, setFsControl] = useState(new FullScreen())
    
	const initialMap = new Map({
		// interactions: defaultInteractions().extend([new Drag()]),
        controls: [fs_control],
		view: new View({
			center: [0, 0],
			zoom: 2,
			maxZoom: max_zoom,
		}),
	})

    // Adiciona o título do mapa
	// initialMap.addControl(new Control({element: controlEl}))

	//Map Variable
	const [map, setMap] = useState(initialMap)

    //Handle Open Layers Bar Menu
    const initialLayersMenu = {
        'menu_camadas': {id: 'menu_camadas', nivel: 0, open: false},
        'gs_GeoCEM': {id: 'gs_GeoCEM', nivel: 1, open: false}
    }
    const [openLM, setOpenLM] = useState(initialLayersMenu);
    //Handle click on menu
    function handleClickLayerMenu(id, nivel = 0) {
        const newOpen = objectMap(openLM, menu => {
            if(menu.id === id)
            menu.open = !menu.open
            else if(menu.id !== id && menu.nivel === nivel)
            menu.open = false
            return menu
        })
        if(openFM === true) setOpenFM(false)
        setOpenLM(newOpen)
    }
    // returns a new object with the values at each key mapped using mapFn(value)
    //Credits to user Amberlamps on stackoverflow
    const objectMap = (obj, fn) =>
    Object.fromEntries(
        Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
        )
    )

    //Handle Open Fill Bar Menu
    const [openFM, setOpenFM] = useState(false);
    const handleClickOpenFM = () => {
        if(openLM['menu_camadas'].open === true) setOpenLM(objectMap(openLM, menu => {
            if(menu.id === 'menu_camadas')
            menu.open = false
            return menu
        }))
        setOpenFM(!openFM);
      };
    
    //Image ID of Mapillary Viewer
    const [mapillary_viewer, setMViewer] = useState(() => []);

    //Panel left size
    const [dividerX, setDividerX] = useState();

    //Panel left size
    const [dividerON, turnDivider] = useState(false);
    
    //Activate slider
    useEffect(() => {
        //Mapillary option
        if(basicOptions.includes('mapillary') && dividerON === false) {
            setDividerX()
            turnDivider(true)
        } else if(!basicOptions.includes('mapillary')) {
            turnDivider(false)
        }
	}, [basicOptions])

    return (
        <Box>
            <Header
                handleOpenBars={handleOpenBars}
             />
            <Grid container className="position-fixed" sx={{ zIndex:  10, zIndex:  10,
                         mt: '15vh', ml: '10px', maxWidth: '384px'}} rowSpacing={1}>
                <Grid item xs={12}>
                    <LayerList 
                        changeLayerURL={setLayerURL}
                        changeAttributes={setAttributes}
                        openBars={openBars}
                        openLM={openLM}
                        handleOpenLM={handleClickLayerMenu}
                    />
                </Grid>
                <Grid item xs={12}>
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
                        openBars={openBars}
                        handleClickOpenFM={handleClickOpenFM}
                        openFM={openFM}
                    />
                </Grid>
            </Grid>
            <BottomBar
                map={map}
				basicOptions={basicOptions}
				onBasicOptionsChange={handleBasicOptionsChange}
                fs_control={fs_control}
                openBars={openBars}
                turnDivider={turnDivider}
            />
            {dividerON ? (<Slider map={map} dividerX={dividerX} changeDX={setDividerX} />) : null}
            <Grid container>
                <Grid item width={dividerX + "px"} display={dividerON ? 'block' : 'none'}>
                    <MapillaryViewer viewer={mapillary_viewer} changeViewer={setMViewer}/>
                </Grid>
                <Grid item>
                    <MapGeo 
                        map={map}
                        max_zoom={max_zoom}
                        layer_url={layer_url} 
                        attributes={attributes}
                        fill_attribute={fill_attribute}
                        method={method}
                        n_classes={n_classes}
                        color_scheme={color_scheme}
                        palette={palette}
                        attributeTitle={attributeTitle}
                        attributesLF={attributesLF}
                        basicOptions={basicOptions}
                        fs_control={fs_control}
                        setFAttribute={setFAttribute}
                        setAttributesLF={setAttributesLF}
                        setAttributeTitle={setAttributeTitle}
                        mapi_viewer={mapillary_viewer}
                    />
                </Grid>
            </Grid>
        </Box>
    
    );
}

export default MainPane