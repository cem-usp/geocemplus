import React, { useEffect, useState } from 'react';
import api from "../services/api";

function Form() {

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
        <form>
            <label>Escolha uma Categoria</label>
            <SelectCategories value={category} categories={categories} onCategoryChange={handleCategoryChange}/>
            <label>Escolha uma Camada</label>
            <SelectLayer layers={layers}/>
        </form>
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
        <select defaultValue={props.value} onChange={handleChange} >
            {options}
       </select>
    );
}

function SelectLayer(props) {

     const options = props.layers.map((layer) =>
        <option key={layer.id} value={layer.id}>{layer.title}</option>
     );

     return (
         <select>
             {options}
        </select>
     );
}


export default Form
