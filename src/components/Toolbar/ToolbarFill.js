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
    const palleteScheme = Palette.getColors()[props.scheme]
    let menuItems = []
    for (const palleteName in palleteScheme) {
        let colorBoxes = []
        for (let i = 0; i < props.steps; i++) {
            const color = palleteScheme[palleteName][props.steps][i];
            colorBoxes.push(<Box sx={{backgroundColor: color}}></Box>)
        }
        const menuItem = <MenuItem key={palleteName} value={palleteName} className='pallete'>{colorBoxes}</MenuItem>
        menuItems.push(menuItem)
    }

    return (
        <FormControl variant="filled"  sx={{ minWidth: 120 }}>
            <InputLabel id="select-palette-filled-label">Paleta de Cores</InputLabel>
            <Select
            labelId="select-palette-filled-label"
            id="palette-select-filled"
            value='GREEN'
            >
                {menuItems}
            </Select>
        </FormControl>
    );
}

export default function ToolbarFill() {

    const [n_classes, setNClasses] = useState(5)
    const [color_scheme, setColorScheme] = useState('sequential')

    function handleNClassesChange(e) {
        setNClasses(e.target.value)
    }

    const handleColorSchemeChange = (event) => {
        console.log(event.target.value)
		setColorScheme(event.target.value);
	};

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
                        value={n_classes}
                        onChange={handleNClassesChange}
                    />
                </Box>

                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-scheme-filled-label">Esquema de Cores</InputLabel>
                    <Select
                    labelId="select-scheme-filled-label"
                    id="scheme-select-filled"
                    onChange={handleColorSchemeChange}
                    value={color_scheme}
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
                    scheme={color_scheme}
                    steps={n_classes}
                />

            </Paper>
        </Box>
    )
}