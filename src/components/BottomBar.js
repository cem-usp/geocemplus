import {useState, React} from "react";

import ExportPNGButton from '../utils/ExportPNGButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import {Add as AddIcon, Remove as RemoveIcon, Map as MapIcon,
        PushPin as PushPinIcon,
        Fullscreen as FullscreenIcon, Download as DownloadIcon,
        Share as ShareIcon, Streetview as StreetviewIcon, ExpandLess as ExpandLessIcon} from '@mui/icons-material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

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

    const [openBBar, setopenBBar] = useState('block');
    const handleopenBBar = () => {
        setopenBBar(!openBBar)
    }

    const StyledGrid = styled(Grid, {
        shouldForwardProp: (prop) => prop !== 'dividerON',
      })(({ dividerON, theme }) => ({
        zIndex:  10, 
        bottom: 10, 
        color: 'black',
        ...(dividerON && {
                right: '3%',
                height: '350px',
                width: '50px',
        }),
        ...(!dividerON && {
            [theme.breakpoints.down('sm')]: {
                right: '3%',
                height: '350px',
                width: '50px',
            },
            [theme.breakpoints.up('sm')]: {
                left: '20%',
                width: '500px',
            },
            [theme.breakpoints.up('md')]: {
                left: '40%',
                width: '500px',
            },
        })
    }));

    const StyledGridItem = styled(Grid)(({ theme }) => ({
        display: 'block',
        [theme.breakpoints.down('sm')]: {
            display: (openBBar ? 'block' : 'none'),
        }
    }));

    return(
        <StyledGrid container rowSpacing={2} columnSpacing={0} dividerON={props.dividerON}
        className="position-fixed">
            
            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <Button value="zoom_in" variant="contained" aria-label="zoom_in" 
                sx={{backgroundColor: "#042E6F", minWidth: '5px', fontSize: '1rem'}}
                onClick={() => {
                    const map_view = props.map.getView()
                    const curr_zoom = map_view.getZoom()
                    map_view.setZoom(curr_zoom+0.5)
                }}>
                    <AddIcon sx={{fontSize: '1rem'}}/>
                </Button>
            </StyledGridItem>
            
            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <Button value="zoom_out" variant="contained" aria-label="zoom_out" 
                sx={{backgroundColor: "#042E6F", minWidth: '5px', fontSize: '1rem'}}
                onClick={() => {
                    const map_view = props.map.getView()
                    const curr_zoom = map_view.getZoom()
                    map_view.setZoom(curr_zoom-0.5)
                }}>
                    <RemoveIcon sx={{fontSize: '1rem'}} />
                </Button>
            </StyledGridItem>
            
            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <Button value="full_screen" aria-label="full_screen" variant="contained" 
                onClick={() => props.fs_control.element.querySelector('button').click()}
                sx={{backgroundColor: "#042E6F", minWidth: '5px'}} 
                >
                    <FullscreenIcon sx={{fontSize: '1rem'}} />
                </Button>
            </StyledGridItem>

            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <StyledToggleButton value="bounds" aria-label="bounds" 
                selected={props.basicOptions.includes('bounds')} 
                onChange={props.onBasicOptionsChange}>
                    <PushPinIcon sx={{fontSize: '1rem'}} />
                </StyledToggleButton>
            </StyledGridItem>

            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <StyledToggleButton value="map" aria-label="map" 
                selected={props.basicOptions.includes('map')} 
                onChange={props.onBasicOptionsChange}>
                    <MapIcon sx={{fontSize: '1rem'}} />
                </StyledToggleButton>
            </StyledGridItem>

            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <StyledToggleButton value="mapillary" aria-label="mapillary" 
                selected={props.basicOptions.includes('mapillary')} 
                onChange={props.onBasicOptionsChange}>
                    <StreetviewIcon sx={{fontSize: '1rem'}} />
                </StyledToggleButton>
            </StyledGridItem>

            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <ExportPNGButton map={props.map}/>
            </StyledGridItem>

            <StyledGridItem xs={12} sm={(props.dividerON) ? 12 : 1.5}>
                <Button value="" variant="contained" aria-label="" 
                sx={{backgroundColor: "#042E6F", minWidth: '5px'}}>
                    <ShareIcon sx={{fontSize: '1rem'}} />
                </Button>
            </StyledGridItem>

            <Grid xs={12} sm={(props.dividerON) ? 12 : 1.5} sx={{justifyContent: 'end', display: {xs: 'inline-flex', sm: 'none'}, alignItems: 'flex-end'}}  >
                <Button value="" variant="contained" aria-label="" 
                sx={{backgroundColor: "#042E6F", minWidth: '5px'}}
                onClick={handleopenBBar}
                >
                    <MoreHorizOutlinedIcon sx={{fontSize: '1rem'}} />
                </Button>
            </Grid>
            
        </StyledGrid>
    )
}