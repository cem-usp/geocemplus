import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import MenuItem from '@mui/material/MenuItem';

export default function Fillbar(props) {
    const [attrList, setAttrList] = useState(null)
    const [filterAttrNames, setFilterAttrNames] = useState(null)
    useEffect(() => {
		const list = (props.attributes) ? props.attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		const filtered_attributes = (props.attributes) ? filterNumberAttributes(props.attributes) : null
		const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
		
		setAttrList(list)
      	setFilterAttrNames(filtered_names)
    },[props.attributes])

    return (
        <Box sx={{ display: 'flex', width: '100%', maxWidth: 360, zIndex:  10,
                         mt: '200px', ml: '10px'}}
                 className="position-fixed">
                <Paper elevation={0} sx={{ bgcolor: '#042E6F', maxHeight: '85vh', overflow: 'auto' }} >
                    <InputLabel sx={{color: 'white'}} id="select-var-filled-label">Atributo de Preenchimento</InputLabel>
                    <Select
                        labelId="select-var-filled-label"
                        id="var-select-filled"
                        value={props.attribute}
                        renderValue={(selected) => selected.attribute_label}
                        onChange={props.onAttributeChange}
                    >
                        <MenuItem value="">
                            <em>Nenhum</em>
                        </MenuItem>
                        {attrList}
                    </Select>
                </Paper>
        </Box>
    )
}