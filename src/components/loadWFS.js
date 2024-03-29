import {axios} from "../services/api";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PublicIcon from '@mui/icons-material/Public';
import LayersIcon from '@mui/icons-material/Layers';
import AddIcon from '@mui/icons-material/Add';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { useEffect, useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import ModalAttributes from './subcomponents/ModalAttributes';
import {NavList} from './subcomponents/NavBarComponents';

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
    }, [geocem_cats, openCat, selectedLayer])

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
       const geocem_list = geocem_cats.map((category) =>
       { 
            const layers = category.layers.map(layer => 
                <Grid container>
                    <Grid item xs={10}>
                        <ListItemButton sx={{ pl: 8 }}
                            selected={selectedLayer === 'geocem_'+layer.id}
                            onClick={(event) => handleLayerClick(event, 'geocem_'+layer.id)}
                            key={'geocem_'+layer.id}
                        >
                            <ListItemIcon>
                                <LayersIcon />
                            </ListItemIcon>
                            <ListItemText primary={layer.title} />
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

            return (
                <div key={category.id}>
                    <ListItemButton sx={{ pl: 4 }}  onClick={() => handleClickCat('cat_'+category.id)}>
                        <ListItemIcon>
                            <AddIcon />
                        </ListItemIcon>
                        <ListItemText primary={category.name} />
                        {openCat['cat_'+category.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={openCat['cat_'+category.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {layers}
                        </List>
                    </Collapse>    
                </div>
            )
            
        });

        setGeoCEMCatsList(geocem_list)
    }
    
    return (
        <Box sx={{ display: (props.openBars ? 'flex' : 'none')}}
             >

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
                            <List component="div" disablePadding sx={{ bgcolor: 'white' }}>

                                {/* Lista de Camadas do GeoCEM */}
                                <ListItemButton onClick={() => props.handleOpenLM('gs_'+geoservices[0].name, 1)}>
                                    <ListItemIcon>
                                        <PublicIcon sx={{ color: '#042E6F' }} />
                                    </ListItemIcon>
                                    <ListItemText primary={geoservices[0].name} />
                                    {props.openLM['gs_'+geoservices[0].name].open ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>
                                <Collapse in={props.openLM['gs_'+geoservices[0].name].open} timeout="auto" unmountOnExit>
                                    <List component="div" sx = {{ bgcolor: 'white' }} disablePadding>
                                        {geocem_cats_list}
                                    </List>
                                </Collapse>

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