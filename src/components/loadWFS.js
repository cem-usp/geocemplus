import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Remove as RemoveIcon, Add as AddIcon,
Layers as LayersIcon, Help as HelpIcon} from '@mui/icons-material/';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import ModalAttributes from './subcomponents/ModalAttributes';
import {NavList} from './subcomponents/NavBarComponents';

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';

const geoservices = [
    {
        name: 'GeoCEM',
        baseurl: 'https://geocem.centrodametropole.fflch.usp.br/api/',
        catalog_category_uri: 'categories/',
        catolog_layers_in_cat_uri: 'layers/?category__identifier__in=',
        wfs_url: 'https://geocem.centrodametropole.fflch.usp.br/geoserver/ows'
    },
    {
        name: 'GeoSampa',
        wfs_url: 'http://wfs.geosampa.prefeitura.sp.gov.br/geoserver/geoportal/wfs',
        catolog_layers_uri: '/?service=wfs&version=2.0.0&request=GetCapabilities'
    }
]

const wfs_requests = {
    base: {
        service: 'wfs',
        version: '2.0.0'
    },
    getLayers: {
        request: 'GetCapabilities'
    }
}

export default function LayerList(props) {
    
    const [openCat, setOpenCat] = useState([]);

    const [geocem_cats, setGeoCEMCats] = useState([])
    const [geocem_cats_list, setGeoCEMCatsList] = useState('')

    const [selectedLayer, setSelectedLayer] = useState(0);

    //Handle Attributes Modal
    const [attributesModal, setAttributesModal] = useState(null)
    const [openAM, setOpenAM] = useState(false)
    const handleOpenAM = (layer_id) => {
        const req_attributes = getGeoCEMLayerAttributes(layer_id)
        req_attributes.then((attributes_response) => {
            setAttributesModal(attributes_response)
            setOpenAM(true)
        })
    };
    const handleCloseAM = () => {
        setOpenAM(false)
    };

    //Handle click on layer
    function handleClickCat(id) {
        let newopen = []
        newopen[id] = !openCat[id]
        setOpenCat(newopen)
    }

    //Load GeoCEM Categories
    useEffect(() => {
        loadGeoCEMCategories()
    }, [])

    //Recreate category list after a change
    useEffect(() => {
        createCatList(props)
    }, [geocem_cats, openCat, selectedLayer, props.plotted_layers])

    //Load layer
    useEffect(() => {
        if(selectedLayer !== 0) {
            const [geoservice, layer_id] = selectedLayer.split('_')

            if(geoservice === 'geocem') {
                fetch(geoservices[0].baseurl + "/layers/" + layer_id)
                .then(function (response) {
                    return response.json();
                })
                .then((response) => {
                    const json_url = response.links.filter(link => link.name === 'GeoJSON')[0].url
                    const https_json = (json_url.startsWith("http://")) ? "https://" + json_url.substring(7) : json_url
                    props.changeLayerURL(https_json)
                    setGeoCEMLayerAttributes(layer_id)
                })
                .catch((err) => {
                    console.error("ops! ocorreu um erro" + err);
                });
            }

        }
    }, [selectedLayer])

    // Add Layer
    const handleAddLayer = (layer_id) => () => {
        props.mapGeoLayers.addLayer(layer_id);
    };
    
    // Remove Layer
    const handleRemoveLayer = (layer_id) => () => {
        props.mapGeoLayers.removeLayer(layer_id);
    };

    function getGeoCEMLayerAttributes(layer_id) {
        return fetch(geoservices[0].baseurl + "v2/layers/" + layer_id + "/attribute_set")
            .then(function (response) {
                return response.json();
            })
            .then((response) => {
                return response.attributes
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });

    }

    function setGeoCEMLayerAttributes(layer_id) {
        fetch(geoservices[0].baseurl + "/v2/layers/" + layer_id + "/attribute_set")
        .then(function (response) {
            return response.json();
        })
        .then((response) => {
            props.changeAttributes(response.attributes)
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });
    }

    function handleOnDragEnd(result) {
        props.mapGeoLayers.reorderLayers(result.source.index, result.destination.index)
    }

    function ListLayers(props) {
        if(props.variant == 'selected') {
            return (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="selected_layers">
                        {(provided) => (
                            <List className="selected_layers" component="div" disablePadding 
                            {...provided.droppableProps} ref={provided.innerRef}>
                                {props.layers.map((layer, index) => {
                                    return(
                                        <Draggable key={layer.id} draggableId={layer.id.toString()} index={(index)}>
                                            {(provided) => (
                                                <ListItem ref={provided.innerRef} 
                                                {...provided.draggableProps}>
                                                    <Grid container>
                                                        <Grid item xs={1} sx={{ alignSelf: 'center' }}>
                                                            <ListItemIcon {...provided.dragHandleProps}>
                                                                <DragHandleIcon />
                                                            </ListItemIcon>
                                                        </Grid>
                                                        <Grid item xs={9}>
                                                            <ListItemButton sx={{ pl: 2 }}
                                                            onClick={handleRemoveLayer(layer.id)}
                                                            key={'geocem_'+layer.id}
                                                            >
                                                                <ListItemText primary={layer.id + ' - ' + layer.name} />
    
                                                                <ListItemIcon>
                                                                    <RemoveIcon />
                                                                </ListItemIcon>
                                                            </ListItemButton>
                                                        </Grid>
                                                        <Grid item xs={2} sx={{ alignSelf: 'center' }}>
                                                            {/* Abre o modal de Atributos */}
                                                            <IconButton onClick={() => handleOpenAM(layer.id)}>
                                                                <HelpIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </Grid>  
                                                </ListItem>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>
            )
        } else {
            return (
                    <List component="div" disablePadding>
                        {props.layers.map((layer, index) => {
                            return(
                                <ListItem key={layer.id}>
                                    <Grid container>
                                        <Grid item xs={10}>
                                            <ListItemButton sx={{ pl: 4 }}
                                            onClick={handleAddLayer(layer.id)}
                                            key={'geocem_'+layer.id}
                                            >
                                                <ListItemIcon>
                                                    <LayersIcon />
                                                </ListItemIcon>

                                                <ListItemText primary={layer.title} />

                                                <ListItemIcon>
                                                    <AddIcon />
                                                </ListItemIcon>
                                            </ListItemButton>
                                        </Grid>
                                        <Grid item xs={2} sx={{ alignSelf: 'center' }}>
                                            {/* Abre o modal de Atributos */}
                                            <IconButton onClick={() => handleOpenAM(layer.id)}>
                                                <HelpIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>  
                                </ListItem>
                            )
                        })}
                    </List>
            )
        }
    }

    function loadGeoCEMCategories() {
        fetch(geoservices[0].baseurl + geoservices[0].catalog_category_uri)
        .then(function (response) {
            return response.json();
        })
        .then((response) => {
            let promises = []
            response.objects.forEach(category => {
                if(category.layers_count > 0 ) {
                    const promise = fetch(geoservices[0].baseurl + geoservices[0].catolog_layers_in_cat_uri + category.identifier)
                        .then(function (response) {
                            return response.json();
                        })
                        .then((reponsecat) => {
                            const new_category = {
                                name: category.gn_description,
                                id: category.id,
                                layers: reponsecat.objects
                            }
                            return new_category
                        })
                    promises.push(promise)
                }
            });
            return promises
        })
        .then((promises) => {
            Promise.all(promises)
            .then((categories) => setGeoCEMCats(categories));
        })
    }

    function createCatList(props) {
        const geocem_list = geocem_cats.map((category) => {
            return (
                <div key={category.id}>
                    <ListItemButton sx={{ pl: 2 }}  onClick={() => handleClickCat('cat_'+category.id)}>
                        <ListItemIcon>
                        {openCat['cat_'+category.id] ? <RemoveIcon /> :<AddIcon />}
                        </ListItemIcon>
                        <ListItemText primary={category.name} />
                    </ListItemButton>

                    <Collapse in={openCat['cat_'+category.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListLayers layers={category.layers} />
                        </List>
                    </Collapse>    
                </div>
            )
            
        });

        setGeoCEMCatsList(geocem_list)
    }

    function SelectedLayers({plotted_layers}) {
        if (plotted_layers.length > 0) {
          return (
                <List component="div" disablePadding sx={{ color: 'text.secondary' }}>
                    <ListItemText disableTypography 
                    primary='Camadas Selecionadas' sx={{fontSize: 'h5.fontSize', fontWeight: 'bold'}} />
                    <ListLayers variant='selected' layers={plotted_layers} checked_layers={props.checked_layers} 
                    setCheckedLayers={props.setCheckedLayers} />
                </List>
            )
        } else return null;
    }
    
    return (
        <Box sx={{ display: (props.openBars ? 'flex' : 'none')}}>

            <Paper elevation={0} sx={{ bgcolor: '#042E6F', maxHeight: '70vh'}} >
                <NavList
                 component="nav"
                 >
                    {/* Menu de Camadas */}
                    <ListItemButton onClick={() => props.handleOpenLM('menu_camadas', 0)} 
                    sx = {{ bgcolor: '#042E6F', color: 'white'}}>
                        <ListItemText primary='Camadas' />
                        {props.openLM['menu_camadas'].open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={props.openLM['menu_camadas'].open} timeout="auto" >
                        <Box sx={{ bgcolor: 'white', maxHeight: '62vh', overflow: 'auto' }}>
                            {/* Lista de Camadas Selecionadas */}
                            <SelectedLayers plotted_layers={props.plotted_layers} />

                            {/* Lista de Camadas do GeoCEM */}
                            <List component="div" disablePadding sx={{ bgcolor: 'white' }}>
                                <ListItemText disableTypography primary='Selecione uma Camada' 
                                sx={{fontSize: 'h6.fontSize', fontWeight: 'bold', textAlign: 'left', ml: '16px'}} />
                                {geocem_cats_list}
                            </List>
                        </Box>
                    </Collapse>

                </NavList>
            </Paper>
            <ModalAttributes
            open={openAM}
            close={handleCloseAM}
            attributes={attributesModal}
            />
        </Box>
      )
}