import React, { useEffect, useState } from 'react';
import {api_geocem, axios} from "../services/api";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function LayerForm() {

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

    const [layers, setLayers] = useState([])
    useEffect(() => {
        setLayer((layers[0] != undefined) ? layers[0].id : 0)
    }, [layers]);

    const [submitReady, setSubmit] = useState(['disabled'])
    const [layer, setLayer] = useState(null)
    useEffect(() => {
        setSubmit((layer > 0) ? false : true)
    }, [layer]);

    function handleSubmit(e) {
        api_geocem
        .get("/layers/"+ layer)
        .then((response) => {
            const json_url = response.data.links.filter(link => link.name === 'GeoJSON')[0].url
            getGeoJSON(json_url)
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });
        alert('The form has been submitted with the layer ' + layer + ' selected')
        e.preventDefault();
    }

    function getGeoJSON(url) {
        axios
        .get(url)
        .then(response => {
            const geojson = response
            console.log(geojson)
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <SelectCategories value={category} categories={categories} onCategoryChange={setCategory}/>
            <SelectLayer layers={layers} onLayerChange={setLayer} />
            <Button variant="primary" type="submit" disabled={submitReady}>
                Selecionar
            </Button>
        </Form>
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
