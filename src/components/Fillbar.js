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

	};
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
    const [palette, setPalette] = useState('')
	const handlePaletteChange = (e,v) => {
        setPalette(v)
    }

    //Panel
    const [panel, setPanel] = useState(0)
    const handlePanelChange = (e) => {
        props.mapGeoLayers.updatePanel(selectedLayer, e.target.value)
        setPanel(e.target.value)
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
						<MenuItem key={layer.id} value={layer}>{layer.name}</MenuItem>
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
                                            return selected.name
                                        }
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>Selecione uma camada</em>
                                    </MenuItem>
                                    {layerList}
                                </Select>

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
                                    // renderValue={(selected) => {
                                    //     if(selected === 0) {
                                    //         return <em>Padrão</em>
                                    //     } else {
                                    //         return <em>Comparado</em>
                                    //     }
                                    // }}
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
                                <Container maxWidth="sm">
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
                                <Container maxWidth="sm" sx={{width:'200px'}}>
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
                                <Container maxWidth="sm">
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
                                <Container maxWidth="sm" sx={{pb: 3}}>
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
                                <FormControl variant="filled" maxWidth="sm" sx={{pb: 3}}>
                                    <InputLabel id="select-title-var-filled-label">Atributo Título</InputLabel>
                                    <Select
                                    labelId="select-title-var-filled-label"
                                    id="title-var-select-filled"
                                        sx={{ minWidth: 200, mb: 1 }}
                                        displayEmpty
                                        value={props.attributeTitle}
                                        onChange={props.onAttributeTitleChange}
                                        renderValue={(selected) => selected.attribute_label}
                                    >
                                        {props.attrList}
                                    </Select>
                                </FormControl>
                                {/* Atributos da legenda */}
                                <SelectAttributes
                                    attributes={props.attributes}
                                    attributesLF={props.attributesLF}
                                    handleALFChange={props.handleALFChange}
                                />
                            </Box>
                        </Collapse>
                     </NavList>
                </Paper>
        </Box>
    )
}