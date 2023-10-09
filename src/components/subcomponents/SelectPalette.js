import React, { useEffect } from 'react';
import Palette from '../../utils/Palette'

//Buttons and other toolbar components
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function SelectPalette(props) {
    const paletteScheme = Palette.getColors()[props.scheme]
    let menuItems = []
    for (const paletteName in paletteScheme) {
        let colorBoxes = []
        for (let i = 0; i < props.steps; i++) {
            const color = paletteScheme[paletteName][props.steps][i];
            colorBoxes.push(<Box key={i.toString()} sx={{backgroundColor: color}}></Box>)
        }
        const menuItem = <ToggleButton key={paletteName} value={paletteName}>
            <Box className='palette'>{colorBoxes}</Box>
        </ToggleButton>
        menuItems.push(menuItem)
    }
    
    useEffect(() => {
        props.setPalette(menuItems[0].key)
    }, [props.scheme])

    return (
            <ToggleButtonGroup
                orientation='vertical'
                exclusive
                value={props.palette}
                onChange={props.handlePaletteChange}
            >
                {menuItems}
            </ToggleButtonGroup>
    );
}