import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import MenuItem from '@mui/material/MenuItem';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';

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

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(!open);
      };
	// const [attribute, setAttribute] = useState("")
    // console.log(attribute)

    return (
        <Box sx={{ display: 'flex', width: '100%', zIndex:  10,
                         mt: '30vh', ml: '10px'}}
                 className="position-fixed">
                <Paper elevation={0} sx={{ bgcolor: '#042E6F', maxHeight: '85vh', overflow: 'auto' }} >
                    <List
                        sx={{width: '18vw', bgcolor: 'white'}}
                        component="nav"
                    >
                        </List>
                </Paper>
        </Box>
    )
}