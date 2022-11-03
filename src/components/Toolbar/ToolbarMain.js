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
				n_classes={props.n_classes}
				handleNClassesChange={props.handleNClassesChange}
				color_scheme={props.color_scheme}
				handleColorSchemeChange={props.handleColorSchemeChange}
				handlePaletteChange={props.handlePaletteChange}
				palette={props.palette}
				setPalette={props.setPalette}
				method={props.method}
				handleMethodChange={props.handleMethodChange}
            />
        </div>
    )
}