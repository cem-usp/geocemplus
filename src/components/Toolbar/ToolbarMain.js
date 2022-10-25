import React from 'react';

//Toolbars
import ToolbarBasic from './ToolbarBasic'
import ToolbarFill from './ToolbarFill'

export default function Toolbar(props) {

    return (
        <div>
            <ToolbarBasic 
                basicOptions={props.basicOptions}
                onBasicOptionsChange={props.onBasicOptionsChange}
                titulo={props.titulo}
                onTituloChange={props.onTituloChange}
                attributes={props.attributes}
                attribute={props.attribute}
                onAttributeChange={props.onAttributeChange}
            />
            <ToolbarFill
            />
        </div>
    )
}