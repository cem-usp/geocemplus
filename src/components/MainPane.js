import GeoLayers from './subcomponents/GeoLayers'
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
import SliderMap from './subcomponents/SliderMap.js';
import '../side-by-side.css';
import Filter from './subcomponents/Filter.js'
import { SignalCellularNullOutlined } from '@mui/icons-material';

function MainPane() {

    //Array of selected layers
    const [checked_layers, setCheckedLayers] = useState([]);
    //Array of geolayers on the map
    const [plotted_layers, setPlottedLayers] = useState([])

    const [attributes, setAttributes] = useState(null)
    
    const [openBars, setOpenBars] = useState('flex');
    const handleOpenBars = () => {
        setOpenBars(!openBars)
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

    //Turn ON/OFF Mapillary Slider Panel
    const [dividerON, turnDivider] = useState(false);

    //Turn ON/OFF Compare / Open Layers (OL) Slider Panel
    const [olDivider, turnOLDivider] = useState(false);

    //Mapillary Organization ID
    const [mapilOID, setMapilOID] = useState('');
    //Mapillary Organization ID Found
    const [moidFound, setMOIDFound] = useState(false);
    
    //rangeValue
    const [dividerRangeValue, setDividerRangeValue] = useState(0.5);
    
    //Activate slider
    useEffect(() => {
        //Mapillary option
        if(basicOptions.includes('mapillary') && dividerON === false) {
            setDividerX()
            turnDivider(true)
            setOpenBars(false)
        } else if(!basicOptions.includes('mapillary')) {
            turnDivider(false)
            setOpenBars(true)
        }
	}, [basicOptions])

    //Check and remove Slider if plotted_layers changes 
    useEffect(() => {
        const hasComparePanel = plotted_layers.some(layer => layer.panel === 1)
        if(!hasComparePanel)
            turnOLDivider(0)
    }, [plotted_layers])

    const sliderEL = useRef(null);
	
    const mapGeoLayers = new GeoLayers(map, basicOptions, checked_layers, 
        plotted_layers, setPlottedLayers, turnOLDivider, sliderEL);
        
    return (
        <Box>
            <Header
                handleOpenBars={handleOpenBars}
             />
            <Grid container className="position-fixed" sx={{ zIndex:  10, zIndex:  10,
                         mt: '15vh', ml: '10px', maxWidth: '384px'}} rowSpacing={1}>
                <Grid item xs={12}>
                    <LayerList 
                        mapGeoLayers={mapGeoLayers}
                        checked_layers={checked_layers} 
                        plotted_layers={plotted_layers}
                        setCheckedLayers={setCheckedLayers}
                        changeAttributes={setAttributes}
                        openBars={openBars}
                        openLM={openLM}
                        handleOpenLM={handleClickLayerMenu}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Fillbar 
                        mapGeoLayers={mapGeoLayers}
                        plotted_layers={plotted_layers}
                        attributes={attributes}
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
                dividerON={dividerON}
                turnDivider={turnDivider}
            />
            {dividerON ? (<Slider type='mapillary' map={map} dividerX={dividerX} changeDX={setDividerX} viewer={mapillary_viewer} />) : null}
            {olDivider ? (<SliderMap type='OL' map={map}  sliderEL={sliderEL} setRange={setDividerRangeValue} rangeValue={dividerRangeValue}
                        dividerX={dividerX} changeDX={setDividerX} mapGeoLayers={mapGeoLayers} />) : null}
            <Grid container>
                    <Grid item style={{width: dividerX + "px"}} display={dividerON ? 'block' : 'none'}>
                        <Box>
                            <Filter mapilOID={mapilOID} setMapilOID={setMapilOID}/>
                            <MapillaryViewer viewer={mapillary_viewer} changeViewer={setMViewer}/>
                        </Box>
                    </Grid>
                <Grid item xs>
                    <Box>
                        <MapGeo 
                            mapGeoLayers={mapGeoLayers}
                            map={map}
                            max_zoom={max_zoom}
                            checked_layers={checked_layers} 
                            plotted_layers={plotted_layers}
                            setPlottedLayers={setPlottedLayers}
                            attributes={attributes}
                            attributeTitle={attributeTitle}
                            attributesLF={attributesLF}
                            basicOptions={basicOptions}
                            fs_control={fs_control}
                            setAttributesLF={setAttributesLF}
                            setAttributeTitle={setAttributeTitle}
                            mapi_viewer={mapillary_viewer}
                            mapilOID={mapilOID}
                            setMOIDFound={setMOIDFound}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    
    );
}

export default MainPane