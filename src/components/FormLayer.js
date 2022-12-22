import React, { useEffect, useState } from 'react';
import {api_geocem, axios} from "../services/api";
import Form from 'react-bootstrap/Form';
import {Button, Row, Col, Card} from 'react-bootstrap/';
import Map from './MapGeo'

function LayerForm() {

    //Loads categories
    const [categories, setCategories] = useState([])
    useEffect(() => {
        api_geocem
        .get("/categories/?type=layer")
        .then((response) => {
            setCategories(response.data.objects)
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });

    }, []);

    //Action when category changes -> loads layers of the category
    const [category, setCategory] = useState('')
    useEffect(() => {
        document.body.style.cursor = "wait"

        api_geocem
        .get("/layers/?category__identifier__in="+ category)
        .then((response) => {
            setLayers(response.data.objects)
            document.body.style.cursor = "default"
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });

    }, [category]);

    //Action when layer changes -> set layer
    const [layers, setLayers] = useState([])
    useEffect(() => {
        setLayer((layers[0] != undefined) ? layers[0].id : 0)
    }, [layers]);

    //Action when layer is set -> enables or disables submit button
    const [submitReady, setSubmit] = useState(['disabled'])
    const [layer, setLayer] = useState(null)
    useEffect(() => {
        setSubmit((layer > 0) ? false : true)
    }, [layer]);

    const [layerGeoJSON, setLayerGeoJSON] = useState(null)
    const [attributes, setAttributes] = useState(null)

    //Action when form is submitted
    function handleSubmit(e) {
        document.body.style.cursor = "wait"
        api_geocem
            .get("/layers/"+ layer)
            .then((response) => {
                const json_url = response.data.links.filter(link => link.name === 'GeoJSON')[0].url
                const https_json = (json_url.startsWith("http://")) ? "https://" + json_url.substring(7) : json_url
                setLayerGeoJSON(https_json)
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
        
        getLayerAttributes(layer)

        e.preventDefault();
    }

    function getLayerAttributes(layer_id) {
        api_geocem
            .get("/v2/layers/" + layer_id + "/attribute_set")
            .then((response) => {
                setAttributes(response.data.attributes)
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
    }

    return (<div className="pb-5">
                <Card>
                    <Card.Header>Formulário da Camada</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <SelectCategories value={category} categories={categories} onCategoryChange={setCategory}/>
                            <SelectLayer layers={layers} onLayerChange={setLayer} />
                            <Button variant="primary" type="submit" disabled={submitReady}>
                                Selecionar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <br />
                <Card>
                    <Card.Header>Visualizar</Card.Header>
                    <Card.Body>
                        <Map geoJSON={layerGeoJSON} attributes={attributes}/>
                    </Card.Body>
                </Card>
            </div>
        
    );
}

//Select Layer Category component
function SelectCategories(props) {
    const options = props.categories.map((category) =>
       <option key={category.identifier} value={category.identifier} >{category.gn_description}</option>
    );

    function handleChange(e) {
        props.onCategoryChange(e.target.value);
    }

    return (
        <Form.Group className="mb-3" controlId="formLayerCategory">
            <Form.Label>Categoria</Form.Label>
            <Form.Select tria-label="Escolha uma Categoria" defaultValue={props.value} onChange={handleChange}>
                {options}
            </Form.Select>
            <Form.Text className="text-muted">
                Escolha uma Categoria para exibir as camadas disponíveis
            </Form.Text>
        </Form.Group>
    );
}

//Select Layer component
function SelectLayer(props) {

    function handleChange(e) {
        props.onLayerChange(e.target.value);
    }

     const options = props.layers.map((layer) =>
        <option key={layer.id} value={layer.id}>{layer.title}</option>
     );

     return (
         <Form.Group className="mb-3" controlId="formLayer">
             <Form.Label>Camada</Form.Label>
             <Form.Select tria-label="Escolha uma Camada" onChange={handleChange}>
                 {options}
             </Form.Select>
             <Form.Text className="text-muted">
                 Escolha uma Camada
             </Form.Text>
         </Form.Group>
     );
}


export default LayerForm
