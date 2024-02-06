import React from "react";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';

export default function FABFilter() {

    const [open, setOpen] = React.useState(false);
    const fabRef = React.useRef(null);
    const txtRef = React.useRef(null);
  
    const handleChange = () => {
        fabRef.current.classList.toggle('enter')
        txtRef.current.classList.toggle('enter')
        setOpen((open) => !open);
    };
    
    return (
      <Box sx={{ left: 20, top: 80, zIndex: 10,}} className="position-fixed">
        <Fab aria-label="filtro" ref={fabRef} className="mapi-filter"> 
          <SearchIcon gutterBottom onClick={handleChange} />
          <TextField ref={txtRef} className="mapi-txtFilter" id="standard-basic" label="ID da Organização" variant="standard"/>
        </Fab>
      </Box>
    );
  }