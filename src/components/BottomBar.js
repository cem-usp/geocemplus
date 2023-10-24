import React from "react";

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Add as AddIcon, Remove as RemoveIcon, Map as MapIcon,
        Fullscreen as FullscreenIcon, Download as DownloadIcon,
        Share as ShareIcon, Streetview as StreetviewIcon} from '@mui/icons-material';

export default function BootomBar(props) {

    return(
        <Box sx={{ display: 'flex', zIndex:  10, bottom: 10, left: '40%'}}
                 className="position-fixed">
            <ButtonGroup aria-label="text button group">
                <Button value="zoom_in" variant="contained" aria-label="zoom_in" sx={{backgroundColor: "#042E6F"}}
                    onClick={() => {
                        const map_view = props.map.getView()
                        const curr_zoom = map_view.getZoom()
                        map_view.setZoom(curr_zoom+0.5)
                    }}>
                    <AddIcon />
                </Button>
                <Button value="zoom_out" variant="contained" aria-label="zoom_out" sx={{backgroundColor: "#042E6F"}}onClick={() => {
                        const map_view = props.map.getView()
                        const curr_zoom = map_view.getZoom()
                        map_view.setZoom(curr_zoom-0.5)
                    }}>
                    <RemoveIcon />
                </Button>
                <ToggleButtonGroup
                  value={props.basicOptions}
                  onChange={props.onBasicOptionsChange}
                  aria-label="basic options"
                >

                    <ToggleButton value="bounds" variant="contained" aria-label="bounds" sx={{backgroundColor: "#042E6F"}}>
                        <FullscreenIcon />
                    </ToggleButton>
                    <ToggleButton value="map" variant="contained" aria-label="map" sx={{backgroundColor: "#042E6F"}}>
                        <MapIcon />
                    </ToggleButton>
                    <ToggleButton value="mapillary" variant="contained" aria-label="mapillary" sx={{backgroundColor: "#042E6F"}}>
                        <StreetviewIcon />
                    </ToggleButton>

                </ToggleButtonGroup>

                <Button value="" variant="contained" aria-label="" sx={{backgroundColor: "#042E6F"}}>
                    <DownloadIcon />
                </Button>
                <Button value="" variant="contained" aria-label="" sx={{backgroundColor: "#042E6F"}}>
                    <ShareIcon />
                </Button>
                </ButtonGroup>
            </Box>
    )
}