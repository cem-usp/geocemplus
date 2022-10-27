import React, { useEffect, useState } from 'react';
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
    
    // useEffect(() => {
    //     props.setPalette(menuItems[0].key)
    // }, [props])

    return (
        <FormControl variant="filled"  sx={{ minWidth: 150 }}>
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
              }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mx:2 }}>
                    <Typography variant="h6">
                        Preenchimento
                    </Typography>
                </Box>
                
                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-method-filled-label">Classificação</InputLabel>
                    <Select
                    labelId="select-method-filled-label"
                    id="method-select-filled"
                    value='quantile'
                    >
                    <MenuItem value="quantile">
                        Quantil
                    </MenuItem>
                    </Select>
                </FormControl>

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

                <SelectPalette 
                    scheme={props.color_scheme}
                    steps={props.n_classes}
                    handlePaletteChange={props.handlePaletteChange}
                    palette={props.palette}
				    setPalette={props.setPalette}
                />

            </Paper>
        </Box>
    )
}