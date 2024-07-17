import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import MenuItem from '@mui/material/MenuItem';

import {NavList} from './subcomponents/NavBarComponents';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Slider from '@mui/material/Slider';

import FormControl from '@mui/material/FormControl';
import SelectPalette from './subcomponents/SelectPalette' 

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';

//Select of Attributes to Tooltip
import SelectAttributes from './subcomponents/SelectAttributes';

import { styled } from '@mui/material/styles';

//Modal
import ModalAttributes from './subcomponents/ModalAttributes';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';

export default function Fillbar(props) {
    const [layerList, setLayerList] = useState(null)
    const [selectedLayer, setLayer] = useState(null)
    const handleLayerChange = (event) => {
        const chose_layer = event.target.value
		setLayer(chose_layer);
	};

    useEffect(() => {
		if(selectedLayer) {
            //Checks if it has defined attribute
            if(!selectedLayer.attribute_to_symbolize)
                setFAttribute(null) 

            //Set symbology as previous defined
            if(selectedLayer.attribute_to_symbolize != null && selectedLayer.symbology != null) {
                setFAttribute(selectedLayer.attribute_to_symbolize) 
                setMethod(selectedLayer.symbology.method)
                setNClasses(selectedLayer.symbology.n_classes)
                setColorScheme(selectedLayer.symbology.color_scheme)
                setPalette(selectedLayer.symbology.palette)
            }

            //Set layer options as previous defined
            if(selectedLayer.ol_layer) {
                setOpacity(selectedLayer.ol_layer.getOpacity())
                setVisibility(selectedLayer.ol_layer.isVisible())
            }

            //Set tooltip options as previous defined
            if(selectedLayer.tooltip.title !== null) {
                setTooltipTitle(selectedLayer.tooltip.title)
            } else {
                setTooltipTitle('')
            }
            if(selectedLayer.tooltip.attributes !== null) {
                setTooltipAttributes(selectedLayer.tooltip.attributes)
            } else {
                setTooltipAttributes([])
            } 

            setPanel(selectedLayer.panel)

        } else {
            //Reset fields
            setFAttribute(null) 
            setMethod('quantile')
            setNClasses(5)
            setColorScheme('sequential')
            setPalette(null)
            setOpacity(1)
            setVisibility(true)
            setTooltipTitle('')
            setTooltipAttributes([])
            setPanel(0)
        }

    }, [selectedLayer])

    useEffect(() => {
        if(!props.openFM) setLayer(null)
    }, [props.openFM])

    // Tooltip options
    const [tooltipTitle, setTooltipTitle] = useState("")
    const [tooltipAttributes, setTooltipAttributes] = useState([])
    
	const handleTooltipATsChange = (e) => {
		setTooltipAttributes(e.target.value);
        props.mapGeoLayers.updateTooltipAttributes(selectedLayer, e.target.value)
	};
    
    const handleTooltipTitleChange = (e) => {
        setTooltipTitle(e.target.value)
        props.mapGeoLayers.updateTooltipTitle(selectedLayer, e.target.value)
    }

    const [attributes, setAttributes] = useState(null)
    const [attrList, setAttrList] = useState(null)
    const [numAttrList, setNumAttrList] = useState(null)

    // Fill parameters state
	const [fill_attribute, setFAttribute] = useState(null)
    const handleFAttributeChange = (event) => {
        const attribute = event.target.value
        props.mapGeoLayers.setAttributeToSimbolize(selectedLayer, attribute)
		setFAttribute(attribute);
	};

    //Fill changes
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
    const [palette, setPalette] = useState(null)
	const handlePaletteChange = (e,v) => {
        setPalette(v)
    }

    //Panel
    const [panel, setPanel] = useState(0)
    const handlePanelChange = (e) => {
        props.mapGeoLayers.updatePanel(selectedLayer, e.target.value)
        setPanel(e.target.value)
    }

    //Opacity
    const [opacity, setOpacity] = useState(1)
    const handleOpacityChange = (e) => {
        if(selectedLayer.ol_layer) {
            selectedLayer.ol_layer.setOpacity(e.target.value)
            setOpacity(e.target.value)
        } 
    }

    //Visibility
    const [visible, setVisibility] = useState(true)
    const handleVisibilityChange = (e) => {
        if(selectedLayer.ol_layer) {
            selectedLayer.ol_layer.setVisible(e.target.checked)
            setVisibility(e.target.checked)
        } 
    }

    useEffect(() => {
        if(fill_attribute && method && n_classes && color_scheme && palette) {
            props.mapGeoLayers.updateSymbology(selectedLayer, {
                method: method,
                n_classes: n_classes,
                color_scheme: color_scheme,
                palette: palette
            })

        } else if(selectedLayer){
            props.mapGeoLayers.resetSymbology(selectedLayer)
            setMethod('quantile')
            setNClasses(5)
		    setColorScheme('sequential');
        }
    },[method, n_classes, palette, fill_attribute, panel])

    useEffect(() => {
		const list = (selectedLayer) ? 
            selectedLayer.attributes.map((attribute) => {
                return (attribute.attribute_label) ? 
                    <MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem> 
                : null
            }
		) : null;
		
		const filtered_attributes = (selectedLayer) ? filterNumberAttributes(selectedLayer.attributes) : null
		const filtered_list = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
		
        setNumAttrList(filtered_list)
		setAttrList(list)
        setAttributes( selectedLayer ? selectedLayer.attributes : null)
    },[selectedLayer])

    useEffect(() => {
        
        //Create layer list
        const list = (props.plotted_layers) ? props.plotted_layers.map((layer) =>
						<MenuItem key={layer.id} value={layer}>{layer.id + ' - ' + layer.name}</MenuItem>
					) : null;
        setLayerList(list)
        
        //Clear selected layer if plotted layer is empty
        if(props.plotted_layers.length === 0) setLayer(null)

    }, [props.plotted_layers])

    // Customized Button Group for Menu
    const MenuToogleBtn = styled(ToggleButton)({
        '&.MuiToggleButton-root': {
            fontSize: '0.6125rem'
        }
    })

    //Handle Attributes Modal
    const [openAM, setOpenAM] = React.useState(false);
    const handleOpenAM = () => setOpenAM(true);
    const handleCloseAM = () => setOpenAM(false);

    return (
        <Box sx={{ display: (props.openBars ? 'flex' : 'none')}}
                 >
                <Paper elevation={0} sx={{ bgcolor: '#042E6F', color: 'white' }} >
                    <NavList
                        component="nav"
                    >
                        {/* Menu de Preenchimento */}
                        <ListItemButton onClick={props.handleClickOpenFM}>
                            <ListItemText primary='Simbologia' />
                            {props.openFM ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={props.openFM} timeout="auto" unmountOnExit>
                            <Box sx={{ bgcolor: 'white', maxHeight: '62vh', overflow: 'auto' }}>
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Camada
                                </InputLabel>
                                
                                <Select
                                    sx={{ mb: 1, maxWidth: '60%' }}
                                    displayEmpty
                                    value={selectedLayer}
                                    onChange={handleLayerChange}
                                    renderValue={(selected) => {
                                        if(selected === null) {
                                            return <em>Nenhuma camada adicionada</em>
                                        } else {
                                            return selected.id + ' - ' + selected.name
                                        }
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>Selecione uma camada</em>
                                    </MenuItem>
                                    {layerList}
                                </Select>

                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Visibilidade da camada
                                </InputLabel>
                                
                                <Grid container spacing={0}>
                                    <Grid item xs={2}>
                                        <FormControlLabel  sx={{ maxWidth: '10%' }}
                                        control={<Checkbox disabled={!selectedLayer} checked={visible} onChange={handleVisibilityChange} />} />
                                    </Grid>
                                    <Grid item xs={8}  sx={{ alignSelf: 'center'}} >
                                        <Slider sx={{ width: '100%' }}
                                            disabled={!visible || !selectedLayer}
                                            getAriaLabel={() => 'Opacidade'}
                                            value={opacity}
                                            onChange={handleOpacityChange}
                                            valueLabelDisplay="auto"
                                            getAriaValueText={() => opacity}
                                            step={0.1}
                                            min={0}
                                            max={1}
                                        />
                                    </Grid>
                                </Grid>

                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Atributo de Preenchimento
                                </InputLabel>

                                <Select
                                    sx={{ mb: 1, maxWidth: '60%' }}
                                    displayEmpty
                                    value={fill_attribute}
                                    onChange={handleFAttributeChange}
                                    disabled={!selectedLayer}
                                    renderValue={(selected) => {
                                        if(selected === null) {
                                            return <em>Selecione um atributo</em>
                                        } else {
                                            return selected.attribute_label
                                        }
                                    }}
                                >
                                    <MenuItem value={null}>
                                        <em>Sem simbolização</em>
                                    </MenuItem>
                                    {numAttrList}
                                </Select>
                                
                                {/* Abre o modal de Atributos */}
                                <IconButton onClick={handleOpenAM}>
                                    <HelpIcon />
                                </IconButton>
                                
                                {!selectedLayer ? null : 
                                    <ModalAttributes
                                    open={openAM}
                                    close={handleCloseAM}
                                    layerModal={selectedLayer.metadata}
                                    />
                                }

                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Painel
                                </InputLabel>

                                <Select
                                    sx={{ mb: 1, maxWidth: '60%' }}
                                    value={panel}
                                    disabled={!fill_attribute}
                                    onChange={handlePanelChange}
                                >
                                    <MenuItem value={0}>
                                        <em>Esquerdo</em>
                                    </MenuItem>
                                    <MenuItem value={1} disabled={!props.mapGeoLayers.canCompare() || props.dividerMapillary}>
                                        <em>Direito</em>
                                    </MenuItem>
                                </Select>

                                {/* Método de Classificação */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Classificação
                                </InputLabel>
                                <Container>
                                    <ToggleButtonGroup sx={{mb: 2}}
                                        exclusive
                                        onChange={handleMethodChange}
                                        disabled={!fill_attribute}
                                        value={method}
                                    >
                                        <MenuToogleBtn size='small' value="quantile">Quantil</MenuToogleBtn>
                                        <MenuToogleBtn size='small' value="jenks">Quebras Naturais (Jenks)</MenuToogleBtn>
                                    </ToggleButtonGroup>
                                </Container>

                                {/* Nº de Classes */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Número de classes
                                </InputLabel>
                                <Container sx={{width:'200px'}}>
                                    <Slider
                                        aria-label="Número de Classes"
                                        defaultValue={5}
                                        valueLabelDisplay="auto"
                                        disabled={!fill_attribute}
                                        step={1}
                                        marks
                                        min={5}
                                        max={7}
                                        value={n_classes}
                                        onChange={handleNClassesChange}
                                    />
                                </Container>

                                {/* Esquema de cores */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Esquema de cores
                                </InputLabel>
                                <Container>
                                    <ToggleButtonGroup sx={{mb: 2}} 
                                        size='small'
                                        exclusive
                                        onChange={handleColorSchemeChange}
                                        value={color_scheme}
                                        disabled={!fill_attribute}
                                    >
                                        <MenuToogleBtn value="sequential">Sequencial</MenuToogleBtn>
                                        <MenuToogleBtn value="diverging">Divergente</MenuToogleBtn>
                                        <MenuToogleBtn value="qualitative">Qualitativo</MenuToogleBtn>
                                    </ToggleButtonGroup>
                                </Container>

                                {/* Paleta de Cores */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Paleta de cores
                                </InputLabel>
                                <Container sx={{pb: 3}}>
                                    <SelectPalette 
                                        disabled={!fill_attribute}
                                        scheme={color_scheme}
                                        setPalette={setPalette}
                                        steps={n_classes}
                                        handlePaletteChange={handlePaletteChange}
                                        palette={palette}
                                    />
                                </Container>

                                {/* Legenda flutuante */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Legenda Flutuante
                                </InputLabel>
                                {/* Atributo título */}
                                <FormControl variant="filled" sx={{pb: 3}}>
                                    <InputLabel id="select-title-var-filled-label">Título dinâmico</InputLabel>
                                    <Select
                                    labelId="select-title-var-filled-label"
                                    id="title-var-select-filled"
                                        sx={{ width: 200, mb: 1 }}
                                        value={tooltipTitle}
                                        onChange={handleTooltipTitleChange}
                                        disabled={!selectedLayer}
                                    >
                                        <MenuItem value="">
                                            <em>Sem título</em>
                                        </MenuItem>
                                        {attrList}
                                    </Select>
                                </FormControl>
                                {/* Atributos da legenda */}
                                <SelectAttributes
                                    attributes={attributes}
                                    tooltipAttributes={tooltipAttributes}
                                    handleALFChange={handleTooltipATsChange}
                                    disabled={!selectedLayer}
                                />
                            </Box>
                        </Collapse>
                     </NavList>
                </Paper>
        </Box>
    )
}