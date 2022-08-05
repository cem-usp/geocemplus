import React, { useEffect, useState } from 'react';
import api from "../services/api";
import Form from 'react-bootstrap/Form';

function LayerForm() {

    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [layers, setLayers] = useState([])

    useEffect(() => {
        api
        .get("/categories/?type=layer")
        .then((response) => {
            setCategories(response.data.objects)
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });

    }, []);

    function handleCategoryChange(category) {
        setCategory(category)

        api
        .get("/layers/?category__identifier__in="+ category)
        .then((response) => {
            setLayers(response.data.objects)
            console.log(response.data.objects.length)
        })
        .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
        });
    }


    return (
        <Form>
            <SelectCategories value={category} categories={categories} onCategoryChange={handleCategoryChange}/>
            <SelectLayer layers={layers}/>
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

     const options = props.layers.map((layer) =>
        <option key={layer.id} value={layer.id}>{layer.title}</option>
     );

     return (
         <Form.Group className="mb-3" controlId="formLayer">
             <Form.Label>Categoria</Form.Label>
             <Form.Select tria-label="Escolha uma Camada">
                 {options}
             </Form.Select>
             <Form.Text className="text-muted">
                 Escolha uma Camada
             </Form.Text>
         </Form.Group>
     );
}


export default LayerForm
