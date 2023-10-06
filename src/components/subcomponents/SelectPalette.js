import React, { useEffect } from 'react';
import Palette from '../../utils/Palette'

//Buttons and other toolbar components
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

export default function SelectPalette(props) {
    const paletteScheme = Palette.getColors()[props.scheme]
    let menuItems = []
    console.log(paletteScheme)
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
        <FormControl variant="filled"  sx={{ ml:1, mx:2, minWidth: 150 }}>
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