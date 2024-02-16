import React from "react";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import BackspaceIcon from '@mui/icons-material/Backspace';

export default function FABFilter(props) {

    const [open, setOpen] = React.useState(false);
  
    const handleChange = () => {
      setOpen((open) => !open);
    };
    
    return (
      <Box sx={{ marginLeft: 5, top: 80, zIndex: 10,}} className="position-fixed">
        <Fab aria-label="filtro" className={`mapi-filter${open ? " enter" : ""}`}> 
          <SearchIcon gutterBottom onClick={handleChange} />
          <TextField className={`mapi-txtFilter${open ? " enter" : ""}`} id="standard-basic" 
            label="ID da Organização" variant="standard" value={props.mapilOID} 
            onChange={(event) => {
              props.setMapilOID(event.target.value);
            }}/>
          <BackspaceIcon className={`mapi-BackspaceIcon${open ? " enter" : ""}`} onClick={() => {props.setMapilOID(''); setOpen(false)}}/>
        </Fab>
      </Box>
    );
  }