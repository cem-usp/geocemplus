import React from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

console.log('bottoms')
export default function BootomBar(props) {

    return(
        <Box sx={{ display: 'flex', zIndex:  10, bottom: 0, left: '50%'}}
                 className="position-fixed">
            <ButtonGroup variant="text" aria-label="text button group">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
                </ButtonGroup>
            </Box>
    )
}