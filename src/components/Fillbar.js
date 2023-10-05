import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import MenuItem from '@mui/material/MenuItem';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Slider from '@mui/material/Slider';

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

	const [fill_attribute, setFAttribute] = useState('')

    return (
        <Box sx={{ display: 'flex', width: '100%', zIndex:  10,
                         mt: '30vh', ml: '10px'}}
                 className="position-fixed">
                <Paper elevation={0} sx={{ bgcolor: '#042E6F', color: 'white', maxHeight: '85vh', overflow: 'auto' }} >
                    <List
                        sx={{width: '18vw'}}
                        component="nav"
                    >
                        {/* Menu de Preenchimento */}
                        <ListItemButton onClick={() => handleClickOpen()}>
                            <ListItemText primary='Preenchimento' />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ bgcolor: 'white' }}>
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Atributo de Preenchimento
                                </InputLabel>
                                <Select
                                    sx={{ mb: 1 }}
                                    displayEmpty
                                    value={fill_attribute}
                                    onChange={props.onAttributeChange}
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
                                        onChange={props.handleMethodChange}
                                        value={props.method}
                                    >
                                        <ToggleButton size='small' value="quantile">Quantil</ToggleButton>
                                        <ToggleButton size='small' value="jenks">Quebras Naturais (Jenks)</ToggleButton>
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
                                        onChange={props.handleNClassesChange}
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
                                        onChange={props.handleColorSchemeChange}
                                        value={props.color_scheme}
                                    >
                                        <ToggleButton value="sequential">Sequencial</ToggleButton>
                                        <ToggleButton value="diverging">Divergente</ToggleButton>
                                        <ToggleButton value="qualitative">Qualitativo</ToggleButton>
                                    </ToggleButtonGroup>
                                </Container>
                            </Box>
                        </Collapse>
                     </List>
                </Paper>
        </Box>
    )
}