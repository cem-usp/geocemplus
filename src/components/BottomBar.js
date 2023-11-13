import React from "react";

import ExportPNGButton from '../utils/ExportPNGButton';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Add as AddIcon, Remove as RemoveIcon, Map as MapIcon,
        PushPin as PushPinIcon,
        Fullscreen as FullscreenIcon, Download as DownloadIcon,
        Share as ShareIcon, Streetview as StreetviewIcon, ExpandLess as ExpandLessIcon} from '@mui/icons-material';
import { fontSize } from "@mui/system";

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

    function getFSControl() {
        let fs_control = null
        props.map.getControls().forEach((control) => {
            if(control.constructor.name == 'FullScreen')
                fs_control = control
        })
        return fs_control
    }

    const fs_control = getFSControl()

    const StyledGrid = styled(Grid)(({ theme }) => ({
        display: (props.openBars ? 'flex' : 'none'),
        zIndex:  10, 
        bottom: 10, 
        width: '500px',
        color: 'black',
        [theme.breakpoints.down('sm')]: {
            left: '10%',
            height: '350px'
        },
        [theme.breakpoints.down('md')]: {
            left: '20%',
        },
        [theme.breakpoints.up('md')]: {
            left: '40%',
        },
    }));

    return(
        <StyledGrid container rowSpacing={2} columnSpacing={0}
        className="position-fixed">
            
            <Grid xs={12} sm={1.5}>
                <Button value="zoom_in" variant="contained" aria-label="zoom_in" sx={{backgroundColor: "#042E6F", minWidth: '5px', fontSize: '1rem'}}
                onClick={() => {
                    const map_view = props.map.getView()
                    const curr_zoom = map_view.getZoom()
                    map_view.setZoom(curr_zoom+0.5)
                }}>
                    <AddIcon sx={{fontSize: '1rem'}}/>
                </Button>
            </Grid>
            
            <Grid xs={12} sm={1.5}>
                <Button value="zoom_out" variant="contained" aria-label="zoom_out" 
                sx={{backgroundColor: "#042E6F", minWidth: '5px', fontSize: '1rem'}}
                onClick={() => {
                    const map_view = props.map.getView()
                    const curr_zoom = map_view.getZoom()
                    map_view.setZoom(curr_zoom-0.5)
                }}>
                    <RemoveIcon sx={{fontSize: '1rem'}} />
                </Button>
            </Grid>
            
            <Grid xs={12} sm={1.5}>
                <Button value="full_screen" aria-label="full_screen" variant="contained" 
                onClick={() => fs_control.element.querySelector('button').click()}
                sx={{backgroundColor: "#042E6F", minWidth: '5px'}} 
                >
                    <FullscreenIcon sx={{fontSize: '1rem'}} />
                </Button>
            </Grid>

            <Grid xs={12} sm={1.5}>
                <StyledToggleButton value="bounds" aria-label="bounds" 
                selected={props.basicOptions.includes('bounds')} 
                onChange={props.onBasicOptionsChange}>
                    <PushPinIcon sx={{fontSize: '1rem'}} />
                </StyledToggleButton>
            </Grid>

            <Grid xs={12} sm={1.5}>
                <StyledToggleButton value="map" aria-label="map" 
                selected={props.basicOptions.includes('map')} 
                onChange={props.onBasicOptionsChange}>
                    <MapIcon sx={{fontSize: '1rem'}} />
                </StyledToggleButton>
            </Grid>

            <Grid xs={12} sm={1.5}>
                <StyledToggleButton value="mapillary" aria-label="mapillary" 
                selected={props.basicOptions.includes('mapillary')} 
                onChange={props.onBasicOptionsChange}>
                    <StreetviewIcon sx={{fontSize: '1rem'}} />
                </StyledToggleButton>
            </Grid>

            <Grid xs={12} sm={1.5}>
                <ExportPNGButton map={props.map}/>
            </Grid>

            <Grid xs={12} sm={1.5}>
                <Button value="" variant="contained" aria-label="" 
                sx={{backgroundColor: "#042E6F", minWidth: '5px'}}>
                    <ShareIcon sx={{fontSize: '1rem'}} />
                </Button>
            </Grid>
            
        </StyledGrid>
    )
}