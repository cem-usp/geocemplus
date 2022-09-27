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
        api_geocem
        .get("/layers/?category__identifier__in="+ category)
        .then((response) => {
            setLayers(response.data.objects)
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

    //Action when form is submitted
    function handleSubmit(e) {
        api_geocem
            .get("/layers/"+ layer)
            .then((response) => {
                const json_url = response.data.links.filter(link => link.name === 'GeoJSON')[0].url
                setLayerGeoJSON(json_url)
            })
            .catch((err) => {
                console.error("ops! ocorreu um erro" + err);
            });
        e.preventDefault();
    }

    return (<div>
                <Card>
                    <Card.Header>Formulário da Camada</Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            {/* <SelectCategories value={category} categories={categories} onCategoryChange={setCategory}/>
                            <SelectLayer layers={layers} onLayerChange={setLayer} /> */}
                            <Button variant="primary" type="submit" disabled={submitReady}>
                                Selecionar
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <br />
                <Card>
                    <Card.Header>Pré-Visualizar</Card.Header>
                    <Card.Body>
                        {/* <Map geoJSON={layerGeoJSON} /> */}
                    </Card.Body>
                </Card>
            </div>
        
    );
}

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
