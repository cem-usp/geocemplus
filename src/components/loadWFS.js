import {axios} from "../services/api";

const wsf_servers = {
    GeoCEM: 'https://geocem.centrodametropole.fflch.usp.br/geoserver/ows',
    GeoSampa: 'http://wfs.geosampa.prefeitura.sp.gov.br/geoserver/geoportal/wfs'
}

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

//Load WFS Servers
useEffect(() => {
    
})

export default function layerSelection(props) {
    return (
        <div>
        </div>
    )
}