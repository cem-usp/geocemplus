import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import MenuItem from '@mui/material/MenuItem';

import List from '@mui/material/List';
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

export default function Fillbar(props) {
    const [attrList, setAttrList] = useState(null)
    const [filterAttrNames, setFilterAttrNames] = useState(null)
    useEffect(() => {
		const list = (props.attributes) ? props.attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		const filtered_attributes = (props.attributes) ? filterNumberAttributes(props.attributes) : null
		const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
		
		setAttrList(list)
      	setFilterAttrNames(filtered_names)
    },[props.attributes])

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(!open);
      };

    // Customized Button Group for Menu
    const MenuToogleBtn = styled(ToggleButton)({
        '&.MuiToggleButton-root': {
            fontSize: '0.6125rem'
        }
    })

    return (
        <Box sx={{ display: 'flex', zIndex:  10,
                         mt: '27vh', ml: '10px'}}
                 className="position-fixed">
                <Paper elevation={0} sx={{ bgcolor: '#042E6F', color: 'white' }} >
                    <List
                        sx={{width: '20vw'}}
                        component="nav"
                    >
                        {/* Menu de Preenchimento */}
                        <ListItemButton onClick={() => handleClickOpen()}>
                            <ListItemText primary='Preenchimento' />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ bgcolor: 'white', maxHeight: '62vh', overflow: 'auto' }}>
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Atributo de Preenchimento
                                </InputLabel>
                                <Select
                                    sx={{ mb: 1 }}
                                    displayEmpty
                                    value={props.fill_attribute}
                                    onChange={props.changeFAttribute}
                                    renderValue={(selected) => {
                                        if(selected === '') {
                                            return <em>Selecione um atributo</em>
                                        } else {
                                            return selected.attribute_label
                                        }
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>Selecione um atributo</em>
                                    </MenuItem>
                                    {attrList}
                                </Select>

                                {/* Método de Classificação */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Classificação
                                </InputLabel>
                                <Container maxWidth="sm">
                                    <ToggleButtonGroup sx={{mb: 2}}
                                        exclusive
                                        onChange={props.changeMethod}
                                        value={props.method}
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
                                        value={props.n_classes}
                                        onChange={props.changeNClasses}
                                    />
                                </Container>

                                {/* Método de Classificação */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Esquema de cores
                                </InputLabel>
                                <Container maxWidth="sm">
                                    <ToggleButtonGroup sx={{mb: 2}} 
                                        size='small'
                                        exclusive
                                        onChange={props.changeCScheme}
                                        value={props.color_scheme}
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
                                        scheme={props.color_scheme}
                                        setPalette={props.setPalette}
                                        steps={props.n_classes}
                                        handlePaletteChange={props.changePallete}
                                        palette={props.palette}
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
                     </List>
                </Paper>
        </Box>
    )
}