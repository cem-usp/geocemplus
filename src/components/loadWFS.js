import {axios} from "../services/api";

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import PublicIcon from '@mui/icons-material/Public';
import ListItemText from '@mui/material/ListItemText';
import LayersIcon from '@mui/icons-material/Layers';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

import React, { useEffect, useState } from 'react';

const geoservices = [
    {
        name: 'GeoCEM',
        catalog_baseurl: 'https://geocem.centrodametropole.fflch.usp.br/',
        catalog_category_uri: '/api/categories/',
        wfs_url: 'https://geocem.centrodametropole.fflch.usp.br/geoserver/ows'
    },
    {
        name: 'GeoSampa',
        wfs_url: 'http://wfs.geosampa.prefeitura.sp.gov.br/geoserver/geoportal/wfs'
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

function requestWFS(wsf_server, request) {
    const api_geocem = axios.create({
        baseURL: wsf_server,
        params: {...wfs_requests.base, ...wfs_requests.request},
    });
}


export default function LayerList(props) {
    
    const [open, setOpen] = useState([]);
    const [layers_lists, setLists] = useState('')
    
    const [geocem_cats, setGeoCEMCats] = useState([])
    const [geocem_cats_list, setGeoCEMCatsList] = useState('')

    function handleClick(id) {
        let newopen = []
        newopen[id] = !open[id]
        console.log(newopen)
        setOpen(newopen)
    }


    useEffect(() => {
        loadGeoCEMCategories()
    }, [])

    useEffect(() => {
        createCatList()
    }, [geocem_cats])

    function loadGeoCEMCategories() {
        const request = axios.create({
            baseURL: geoservices[0].catalog_baseurl,
            params: {type: 'layer'},
        });

        request.get(geoservices[0].catalog_category_uri)
            .then((response) => {
                setGeoCEMCats(response.data.objects)
            })
    }

    function createCatList() {
        setGeoCEMCatsList (geocem_cats.map(category => 
            <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                    <LayersIcon />
                </ListItemIcon>
                <ListItemText primary={category.gn_description} />
            </ListItemButton>
            
        ));
    }

    const geoservices_list = geoservices.map(function (geoservice, i) {        
        return (
            <div key={geoservice.name}>

                <ListItemButton onClick={() => handleClick(geoservice.name)}>
                    <ListItemIcon>
                        <PublicIcon />
                    </ListItemIcon>
                    <ListItemText primary={geoservice.name} />
                    {open[geoservice.name] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={open[geoservice.name]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {geocem_cats_list}
                    </List>
                </Collapse>

            </div>

        )
    })

    return (
        <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                Bases de dados Cartográficas
                </ListSubheader>
            }
        >

            {geoservices_list}

        </List>
      )
}