import {axios} from "../services/api";

import List from '@mui/material/List';
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

import Checkbox from '@mui/material/Checkbox';

const geoservices = [
    {
        name: 'GeoCEM',
        baseurl: 'https://geocem.centrodametropole.fflch.usp.br/api/',
        catalog_category_uri: 'categories/',
        catolog_layers_in_cat_uri: '/layers/?category__identifier__in=',
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
    const [checked, setChecked] = useState([]);

    //Handle click on layer
    const handleLayerClick = (event, index) => {
        setSelectedLayer(index);
    };

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
        // loadGeoSampaLayers()
    }, [])

    //Recreate category list after a change
    useEffect(() => {
        createCatList()
    }, [geocem_cats, openCat, selectedLayer, checked])

    //Load layer
    useEffect(() => {
        if(selectedLayer !== 0) {
            const [geoservice, layer_id] = selectedLayer.split('_')

            if(geoservice === 'geocem') {
                const request = axios.create({
                    baseURL: geoservices[0].baseurl
                });  
        
                request
                .get("/layers/"+ layer_id)
                .then((response) => {
                    const json_url = response.data.links.filter(link => link.name === 'GeoJSON')[0].url
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

    function getGeoCEMLayerAttributes(layer_id) {
        const request = axios.create({
            baseURL: geoservices[0].baseurl
        });  
    
        return request
            .get("/v2/layers/" + layer_id + "/attribute_set")
            .then((response) => {
                return response.data.attributes
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });

    }

    function setGeoCEMLayerAttributes(layer_id) {
        
        const request = axios.create({
            baseURL: geoservices[0].baseurl
        });  
    
        request
            .get("/v2/layers/" + layer_id + "/attribute_set")
            .then((response) => {
                props.changeAttributes(response.data.attributes)
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    }

    function ListLayers(props) {

        const handleCheck = (layer) => () => {
            const currentIndex = checked.findIndex((clayer) => clayer.id == layer.id);
            const newChecked = [...checked];
        
            if (currentIndex === -1) {
                newChecked.push(layer);
            } else {
                newChecked.splice(currentIndex, 1);
            }
        
            console.log('clicados', newChecked)
            setChecked(newChecked); //Começar aqui
        };
        

        return (
            <List component="div" disablePadding>
                {props.layers.map((layer) => {
                    return(
                        <Grid container>
                            <Grid item xs={10}>
                                <ListItemButton sx={{ pl: 4 }}
                                onClick={handleCheck(layer)}
                                key={'geocem_'+layer.id}
                                >
                                    <ListItemIcon>
                                        <LayersIcon />
                                    </ListItemIcon>

                                    <ListItemText primary={layer.title} />

                                    <ListItemIcon>
                                        <Checkbox
                                        checked={checked.findIndex((clayer) => clayer.id == layer.id) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        />
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
                    )
                })}
            </List>
        )
    }

    function loadGeoCEMCategories() {
        const request = axios.create({
            baseURL: geoservices[0].baseurl,
            params: {type: 'layer'},
        });        
        
        request.get(geoservices[0].catalog_category_uri)
            .then((response) => {
                let promises = []
                response.data.objects.forEach(category => {
                    if(category.layers_count > 0 ) {
                        const promise = request
                            .get(geoservices[0].catolog_layers_in_cat_uri+category.identifier)
                            .then((reponsecat) => {
                                const new_category = {
                                    name: category.gn_description,
                                    id: category.id,
                                    layers: reponsecat.data.objects
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

    //Implementação Suspensa
    function loadGeoSampaLayers() {       
        const request = axios.create({
            baseURL: geoservices[1].wfs_url,
          });

            request.get(geoservices[1].wfs_url, {
            params: {
                service: 'wfs',
                version: '2.0.0',
                request: 'GetCapabilities'
            }
        })
        .then((response) => {
            console.log(response)
        })
        
    }

    function createCatList() {

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
                            <ListLayers layers={category.layers}/>
                        </List>
                    </Collapse>    
                </div>
            )
            
        });

        setGeoCEMCatsList(geocem_list)
    }

    function SelectedLayers({checked}) {
        if (checked.length > 0) {
          return (
            <List component="div" disablePadding sx={{ color: 'text.secondary' }}>
                <ListItemText disableTypography 
                primary='Camadas Selecionadas' sx={{fontSize: 'h5.fontSize', fontWeight: 'bold'}} />
                <ListLayers layers={checked}/>
            </List>
            )
        } else 
        return null;
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
                            <SelectedLayers  checked={checked} />

                            {/* Lista de Camadas do GeoCEM */}
                            <List component="div" disablePadding sx={{ bgcolor: 'white' }}>
                                <ListItemText disableTypography primary='Selecione uma Camada' 
                                sx={{fontSize: 'h5.fontSize', fontWeight: 'bold'}} />
                                {geocem_cats_list}
                            </List>
                        </Box>
                    </Collapse>

                    {/* Lista de Camadas do GeoSampa */}
                    {/* SUSPENSO DEVIDO À CORS */}
                    {/* <ListItemButton onClick={() => props.handleOpenLM('gs_'+geoservices[1].name)}>
                        <ListItemIcon>
                            <PublicIcon />
                        </ListItemIcon>
                        <ListItemText primary={geoservices[1].name} />
                        {openLM['gs_'+geoservices[1].name] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={openLM['gs_'+geoservices[1].name]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {}
                        </List>
                    </Collapse> */}

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