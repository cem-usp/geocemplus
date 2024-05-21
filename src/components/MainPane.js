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
import { Grid } from '@mui/material';
import MapillaryViewer from './Mapillary'
import Slider from './subcomponents/Slider.js';
import SliderMap from './subcomponents/SliderMap.js';
import '../side-by-side.css';
import Filter from './subcomponents/Filter.js'
import {FullScreen, defaults as defaultControls} from 'ol/control.js';

function MainPane() {

    //Array of selected layers
    const [counter, setCounter] = useState([]);
    //Array of geolayers on the map
    const [plotted_layers, setPlottedLayers] = useState([])

    const [attributes, setAttributes] = useState(null)
    
    const [openBars, setOpenBars] = useState('flex');
    const handleOpenBars = () => {
        setOpenBars(!openBars)
    }

    //Update Attribute list options when layer changes
    // const [attrList, setAttrList] = useState(null)
    // const [filterAttrNames, setFilterAttrNames] = useState(null)
    // useEffect(() => {
	// 	const list = (attributes) ? attributes.map((attribute) =>
	// 					<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
	// 					) : null;
		
	// 	const filtered_attributes = (attributes) ? filterNumberAttributes(attributes) : null
	// 	const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
	// 								<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
	// 								) : null;
		
	// 	setAttrList(list)
    //   	setFilterAttrNames(filtered_names)
    // },[attributes])

	const [basicOptions, setBasicOptions] = useState(() => ['map']);
    const handleBasicOptionsChange = (event, option) => {
        let arr = [...basicOptions]
        const isDeselected = basicOptions.indexOf(option)

        if(isDeselected > -1) arr.splice(isDeselected, 1)
        else arr = arr.concat(option)

        setBasicOptions(arr)
	};

    //OL Map
    //Max Zoom
    const max_zoom = 20
	//Initialize map
    const [fs_control, setFsControl] = useState(new FullScreen())

	const initialMap = new Map({
        controls: [],
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

        mapGeoLayers.updateView() //criar option separada

	}, [basicOptions])

    //Check and remove Slider if plotted_layers changes 
    useEffect(() => {

        //Updates panel
        const hasComparePanel = plotted_layers.some(layer => layer.panel === 1)
        if(!hasComparePanel)
            turnOLDivider(0)
        
        //Updates bottom legend
        mapGeoLayers.updateLegend()

        //remove tooltip if any
        mapGeoLayers.updateTooltipLegend() 

    }, [plotted_layers])

    const sliderEL = useRef(null);
	
    const mapGeoLayers = new GeoLayers(map, basicOptions, counter, setCounter,
        plotted_layers, setPlottedLayers, turnOLDivider, sliderEL);
        
    return (
        <Box>
            <Header
                handleOpenBars={handleOpenBars}
             />
            <Grid container className="position-fixed" sx={{ zIndex:  10, zIndex:  10,
                         mt: '90px', ml: '10px', maxWidth: '384px'}} rowSpacing={1}>
                <Grid item xs={12}>
                    <LayerList 
                        mapGeoLayers={mapGeoLayers}
                        plotted_layers={plotted_layers}
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
                plotted_layers={plotted_layers}
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
                            plotted_layers={plotted_layers}
                            setPlottedLayers={setPlottedLayers}
                            attributes={attributes}
                            basicOptions={basicOptions}
                            fs_control={fs_control}
                            mapi_viewer={mapillary_viewer}
                            mapilOID={mapilOID}
                            setMOIDFound={setMOIDFound}
                            setFsContro={setFsControl}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    
    );
}

export default MainPane