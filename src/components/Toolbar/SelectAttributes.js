import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

export default function MultipleSelectCheckmarks(props) {

    return (
        <div>
          <FormControl variant="filled" sx={{ ml: 1, width: 200 }}>
            <InputLabel id="demo-multiple-checkbox-label">Legenda Flutuante</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={props.attributesTT}
              onChange={props.handleATTChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {(props.attributes) ? props.attributes.map((attribute) => (
                <MenuItem key={attribute.attribute} value={attribute.attribute}>
                  <Checkbox checked={props.attributesTT.indexOf(attribute.attribute) > -1} />
                  <ListItemText primary={attribute.attribute} />
                </MenuItem>
              )) : null}
            </Select>
          </FormControl>
        </div>
      );
}