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

import React, { useEffect, useState } from 'react';

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

// returns a new object with the values at each key mapped using mapFn(value)
//Credits to user Amberlamps on stackoverflow
const objectMap = (obj, fn) =>
  Object.fromEntries(
    Object.entries(obj).map(
      ([k, v], i) => [k, fn(v, k, i)]
    )
  )

export default function LayerList(props) {
    
    const initialMenu = {
        'menu_camadas': {id: 'menu_camadas', nivel: 0, open: false},
        'gs_GeoCEM': {id: 'gs_GeoCEM', nivel: 1, open: false}
    }
    const [open, setOpen] = useState(initialMenu);
    const [openCat, setOpenCat] = useState([]);

    const [geocem_cats, setGeoCEMCats] = useState([])
    const [geocem_cats_list, setGeoCEMCatsList] = useState('')

    const [selectedLayer, setSelectedLayer] = React.useState(0);

    //Handle click on layer
    const handleLayerClick = (event, index) => {
        setSelectedLayer(index);
    };
    
    //Handle click on geoservice
    function handleClick(id, nivel = 0) {
        const newOpen = objectMap(open, menu => {
            if(menu.id === id)
                menu.open = !menu.open
            else if(menu.id !== id && menu.nivel === nivel)
                menu.open = false
            return menu
        })
        setOpen(newOpen)
    }

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
                <ListItemButton sx={{ pl: 8 }}
                    selected={selectedLayer === 'geocem_'+layer.id}
                    onClick={(event) => handleLayerClick(event, 'geocem_'+layer.id)}
                    key={'geocem_'+layer.id}
                >
                    <ListItemIcon>
                        <LayersIcon />
                    </ListItemIcon>
                    <ListItemText primary={layer.title} />
                </ListItemButton>)

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
        <Box sx={{ display: 'flex',  zIndex:  20,
                     mt: '15vh', ml: '10px'}}
             className="position-fixed">

            <Paper elevation={0} sx={{ bgcolor: '#042E6F', maxHeight: '85vh', overflow: 'auto' }} >
                <List
                    sx={{width: '20vw'}}
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                >
                    {/* Menu de Camadas */}
                    <ListItemButton onClick={() => handleClick('menu_camadas', 0)} 
                    sx = {{ bgcolor: '#042E6F', color: 'white' }}>
                        <ListItemText primary='Camadas' />
                        {open['menu_camadas'].open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={open['menu_camadas'].open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ bgcolor: 'white' }}>

                            {/* Lista de Camadas do GeoCEM */}
                            <ListItemButton onClick={() => handleClick('gs_'+geoservices[0].name, 1)}>
                                <ListItemIcon>
                                    <PublicIcon sx={{ color: '#042E6F' }} />
                                </ListItemIcon>
                                <ListItemText primary={geoservices[0].name} />
                                {open['gs_'+geoservices[0].name].open ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={open['gs_'+geoservices[0].name].open} timeout="auto" unmountOnExit>
                                <List component="div" sx = {{ bgcolor: 'white' }} disablePadding>
                                    {geocem_cats_list}
                                </List>
                            </Collapse>

                        </List>
                    </Collapse>

                    {/* Lista de Camadas do GeoSampa */}
                    {/* SUSPENSO DEVIDO À CORS */}
                    {/* <ListItemButton onClick={() => handleClick('gs_'+geoservices[1].name)}>
                        <ListItemIcon>
                            <PublicIcon />
                        </ListItemIcon>
                        <ListItemText primary={geoservices[1].name} />
                        {open['gs_'+geoservices[1].name] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    <Collapse in={open['gs_'+geoservices[1].name]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {}
                        </List>
                    </Collapse> */}

                </List>
            </Paper>
        </Box>
      )
}