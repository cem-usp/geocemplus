import React, { useEffect } from 'react';
import Palette from '../../utils/Palette'

//Buttons and other toolbar components
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Slider } from '@mui/material';

//Select of Attributes to Tooltip
import SelectAttributes from './SelectAttributes';

function SelectPalette(props) {
    const paletteScheme = Palette.getColors()[props.scheme]
    let menuItems = []
    for (const paletteName in paletteScheme) {
        let colorBoxes = []
        for (let i = 0; i < props.steps; i++) {
            const color = paletteScheme[paletteName][props.steps][i];
            colorBoxes.push(<Box key={i.toString()} sx={{backgroundColor: color}}></Box>)
        }
        const menuItem = <MenuItem key={paletteName} value={paletteName}>
            <Box className='palette'>{colorBoxes}</Box>
        </MenuItem>
        menuItems.push(menuItem)
    }
    
    useEffect(() => {
        props.setPalette(menuItems[0].key)
    }, [props.scheme])

    return (
        <FormControl variant="filled"  sx={{ ml:1, minWidth: 150 }}>
            <InputLabel id="select-palette-filled-label">Paleta de Cores</InputLabel>
            <Select
                labelId="select-palette-filled-label"
                id="palette-select-filled"
                value={props.palette}
                onChange={props.handlePaletteChange}
            >
                {menuItems}
            </Select>
        </FormControl>
    );
}

export default function ToolbarFill(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Paper
              elevation={0}
              sx={{
              display: 'flex',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
              alignItems: 'center', 
              }}
            >   
                {/* Label Preenchimento */}
                <Box sx={{ display: 'flex', mx:2 }}>
                    <Typography variant="h6">
                        Preenchimento
                    </Typography>
                </Box>
                
                {/* Classificação de Dados */}
                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-method-filled-label">Classificação</InputLabel>
                    <Select
                    labelId="select-method-filled-label"
                    id="method-select-filled"
                    onChange={props.handleMethodChange}
                    value={props.method}
                    >
                    <MenuItem value="quantile">
                        Quantil
                    </MenuItem>
                    <MenuItem value="jenks">
                        Quebras Naturais (Jenks)
                    </MenuItem>
                    </Select>
                </FormControl>

                {/* Nº de Classes */}
                <Box sx={{ display: 'flex', alignItems: 'center', mx:2, width: 70 }}>
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
                </Box>

                {/* Esquema de Cores */}
                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-scheme-filled-label">Esquema de Cores</InputLabel>
                    <Select
                    labelId="select-scheme-filled-label"
                    id="scheme-select-filled"
                    onChange={props.handleColorSchemeChange}
                    value={props.color_scheme}
                    >
                        <MenuItem value="sequential">
                            Sequencial
                        </MenuItem>
                        <MenuItem value="diverging">
                            Divergente
                        </MenuItem>
                        <MenuItem value="qualitative">
                            Qualitativo
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* Paleta */}
                <SelectPalette 
                    scheme={props.color_scheme}
                    steps={props.n_classes}
                    handlePaletteChange={props.handlePaletteChange}
                    palette={props.palette}
				    setPalette={props.setPalette}

                />

                {/* Esquema de Cores */}
                <SelectAttributes
                    attributes={props.attributes}
                    attributesTT={props.attributesTT}
                    handleATTChange={props.handleATTChange}
                />

            </Paper>
        </Box>
    )
}