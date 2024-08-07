import {useState, React} from "react";

import ExportPNGButton from '../utils/ExportPNGButton';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ToggleButton from '@mui/material/ToggleButton';
import {Add as AddIcon, Remove as RemoveIcon, Map as MapIcon,
        PushPin as PushPinIcon,
        Fullscreen as FullscreenIcon,
        Share as ShareIcon, Streetview as StreetviewIcon} from '@mui/icons-material';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import Tooltip from '@mui/material/Tooltip';

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
      })(({ dividerMapillary, theme }) => ({
        zIndex:  10, 
        bottom: 10, 
        color: 'black',
        ...(dividerMapillary && {
                right: '3%',
                height: '350px',
                width: '50px',
        }),
        ...(!dividerMapillary && {
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
        <StyledGrid container rowSpacing={2} columnSpacing={0} dividerMapillary={props.dividerMapillary}
        className="position-fixed">
            
            <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Tooltip title='Aumentar o zoom'>
                    <Button value="zoom_in" variant="contained" aria-label="zoom_in" 
                    sx={{backgroundColor: "#042E6F", minWidth: '5px', fontSize: '1rem'}}
                    onClick={() => {
                        const map_view = props.map.getView()
                        const curr_zoom = map_view.getZoom()
                        map_view.setZoom(curr_zoom+0.5)
                    }}>
                        <AddIcon sx={{fontSize: '1rem'}}/>
                    </Button>
                </Tooltip>
            </StyledGridItem>
            
            <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Tooltip title='Diminuir o zoom'>
                    <Button value="zoom_out" variant="contained" aria-label="zoom_out" 
                    sx={{backgroundColor: "#042E6F", minWidth: '5px', fontSize: '1rem'}}
                    onClick={() => {
                        const map_view = props.map.getView()
                        const curr_zoom = map_view.getZoom()
                        map_view.setZoom(curr_zoom-0.5)
                    }}>
                        <RemoveIcon sx={{fontSize: '1rem'}} />
                    </Button>
                </Tooltip>
            </StyledGridItem>
            
            <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Tooltip title='Tela cheia'>
                    <Button value="full_screen" aria-label="full_screen" variant="contained" 
                    onClick={() => props.fs_control.element.querySelector('button').click()}
                    sx={{backgroundColor: "#042E6F", minWidth: '5px'}} 
                    >
                        <FullscreenIcon sx={{fontSize: '1rem'}} />
                    </Button>
                </Tooltip>
            </StyledGridItem>

            <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Tooltip title='Fixar mapa'>
                    <StyledToggleButton value="bounds" aria-label="bounds" 
                    selected={props.basicOptions.includes('bounds')} 
                    onChange={props.onBasicOptionsChange}>
                        <PushPinIcon sx={{fontSize: '1rem'}} />
                    </StyledToggleButton>
                </Tooltip>
            </StyledGridItem>

            <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Tooltip title={(props.basicOptions.includes('map') ? 'Desativar' : 'Ativar') + ' Camada-base'}>
                <StyledToggleButton value="map" aria-label="map" 
                    selected={props.basicOptions.includes('map')} 
                    onChange={props.onBasicOptionsChange}>
                        <MapIcon sx={{fontSize: '1rem'}} />
                    </StyledToggleButton>
                </Tooltip>
            </StyledGridItem>

            <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Tooltip title={(props.basicOptions.includes('mapillary') ? 'Desativar' : 'Ativar') + ' Mapillary'}>
                    <StyledToggleButton value="mapillary" aria-label="mapillary" 
                    selected={props.basicOptions.includes('mapillary')} 
                    disabled={props.olDivider}
                    onChange={props.onBasicOptionsChange}>
                        <StreetviewIcon sx={{fontSize: '1rem'}} />
                    </StyledToggleButton>
                </Tooltip>
            </StyledGridItem>

            <Tooltip title='Exportar mapa como imagem'>
                <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                    <ExportPNGButton map={props.map}/>
                </StyledGridItem>
            </Tooltip>

            {/* <StyledGridItem item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5}>
                <Button variant="contained"
                sx={{backgroundColor: "#042E6F", minWidth: '5px'}}>
                    <ShareIcon sx={{fontSize: '1rem'}} />
                </Button>
            </StyledGridItem> */}

            <Grid item xs={12} sm={(props.dividerMapillary) ? 12 : 1.5} sx={{justifyContent: 'end', display: {xs: 'inline-flex', sm: 'none'}, alignItems: 'flex-end'}}  >
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