import React from "react";

import ExportPNGButton from '../utils/ExportPNGButton';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Add as AddIcon, Remove as RemoveIcon, Map as MapIcon,
        Fullscreen as FullscreenIcon, Download as DownloadIcon,
        Share as ShareIcon, Streetview as StreetviewIcon, ExpandLess as ExpandLessIcon} from '@mui/icons-material';


//Button toogle style
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
          backgroundColor: "white",
          color: 'black',
          '&:hover': {
              backgroundColor: 'rgb(17, 82, 147)',
                color: 'white',
        },
          '&.Mui-selected': {
              backgroundColor: '#042E6F',
              color: 'white',
            }
}));

export default function BootomBar(props) {

    return(
        <Box sx={{ display: 'flex', zIndex:  10, bottom: 10, left: '40%'}}
                 className="position-fixed">
            <ButtonGroup aria-label="text button group" orientation="horizontal">
                <ToggleButton>
                    <ExpandLessIcon />
                </ToggleButton>
                <Button value="zoom_in" variant="contained" aria-label="zoom_in" sx={{backgroundColor: "#042E6F", width: '60px'}}
                    onClick={() => {
                        const map_view = props.map.getView()
                        const curr_zoom = map_view.getZoom()
                        map_view.setZoom(curr_zoom+0.5)
                    }}>
                    <AddIcon />
                </Button>
                <Button value="zoom_out" variant="contained" aria-label="zoom_out" sx={{backgroundColor: "#042E6F", width: '60px'}}onClick={() => {
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
                  orientation="horizontal"
                >

                    <StyledToggleButton value="bounds" aria-label="bounds">
                        <FullscreenIcon />
                    </StyledToggleButton>
                    <StyledToggleButton value="map" aria-label="map">
                        <MapIcon />
                    </StyledToggleButton>
                    <StyledToggleButton value="mapillary" aria-label="mapillary">
                        <StreetviewIcon />
                    </StyledToggleButton>

                </ToggleButtonGroup>
                
                <ExportPNGButton map={props.map}/>
                
                <Button value="" variant="contained" aria-label="" sx={{backgroundColor: "#042E6F", width: '60px'}}>
                    <ShareIcon />
                </Button>
                </ButtonGroup>
            </Box>
    )
}