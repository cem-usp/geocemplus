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
		setFAttribute(chose_layer.attribute_to_symbolize);
        setPanel(chose_layer.panel)

        //Set symbology as previous defined
        if(chose_layer.attribute_to_symbolize != null && chose_layer.symbology != null) {
            setMethod(chose_layer.symbology.method)
            setNClasses(chose_layer.symbology.n_classes)
            setColorScheme(chose_layer.symbology.color_scheme)
            setPalette(chose_layer.symbology.palette)
        }

        //Set layer options as previous defined
        if(chose_layer.ol_layer) {
            setOpacity(chose_layer.ol_layer.getOpacity())
            setVisibility(chose_layer.ol_layer.isVisible())
        }

        //Set tooltip options as previous defined
        if(chose_layer.tooltip.title !== null) {
            setTooltipTitle(chose_layer.tooltip.title)
        } else {
            setTooltipTitle('')
        }
        if(chose_layer.tooltip.attributes !== null) {
            setTooltipAttributes(chose_layer.tooltip.attributes)
        } else {
            setTooltipAttributes([])
        }

	};

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
        if(fill_attribute !== null) {
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
    },[method, n_classes, color_scheme, palette, fill_attribute, panel])

    useEffect(() => {
		const list = (selectedLayer) ? selectedLayer.attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		// const filtered_attributes = (props.attributes) ? filterNumberAttributes(props.attributes) : null
		// const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
		// 							<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
		// 							) : null;
		
        // setFilterAttrNames(filtered_names)
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
                                        control={<Checkbox checked={visible} onChange={handleVisibilityChange} />} label="Visibilidade" />
                                    </Grid>
                                    <Grid item xs={8}  sx={{ alignSelf: 'center'}} >
                                        <Slider sx={{ width: '100%' }}
                                            disabled={!visible}
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
                                    {attrList}
                                </Select>
                                
                                {/* Abre o modal de Atributos */}
                                <IconButton onClick={handleOpenAM}>
                                    <HelpIcon />
                                </IconButton>

                                <ModalAttributes
                                open={openAM}
                                close={handleCloseAM}
                                attributes={attributes}
                                >
                                </ModalAttributes>

                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Painel
                                </InputLabel>

                                <Select
                                    sx={{ mb: 1, maxWidth: '60%' }}
                                    value={panel}
                                    onChange={handlePanelChange}
                                >
                                    <MenuItem value={0}>
                                        <em>Padrão</em>
                                    </MenuItem>
                                    <MenuItem value={1} disabled={props.mapGeoLayers.canCompare()}>
                                        <em>Comparado</em>
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
                                        sx={{ minWidth: 200, mb: 1 }}
                                        value={tooltipTitle}
                                        onChange={handleTooltipTitleChange}
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
                                />
                            </Box>
                        </Collapse>
                     </NavList>
                </Paper>
        </Box>
    )
}