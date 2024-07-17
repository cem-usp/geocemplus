import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

export default function MultipleSelectCheckmarks(props) {
    const selected_labels = (props.tooltipAttributes) ? props.tooltipAttributes.map(({attribute_label}) => attribute_label) : []

    return (
        <div >
          <FormControl variant="filled" sx={{ ml: 1, width: 200, pb: 3 }}>
            <InputLabel id="demo-multiple-checkbox-label">Legenda Flutuante</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={props.tooltipAttributes}
              disabled={props.disabled}
              onChange={props.handleALFChange}
              renderValue={(selected) => {
                  const labels = selected.map(({attribute_label}) => attribute_label)
                  return labels.join(', ')
                }
              }
            >
              {(props.attributes) ? props.attributes.map((attribute) => (
                (attribute.attribute_label) ?
                  <MenuItem key={attribute.attribute} value={attribute}>
                    <Checkbox checked={selected_labels.indexOf(attribute.attribute_label) > -1} />
                    <ListItemText primary={attribute.attribute_label} />
                  </MenuItem>
                :null
              )) : null}
            </Select>
          </FormControl>
        </div>
      );
}