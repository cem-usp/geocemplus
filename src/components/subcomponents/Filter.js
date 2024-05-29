import React from "react";
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import BackspaceIcon from '@mui/icons-material/Backspace';

export default function FABFilter(props) {

    const [open, setOpen] = React.useState(false);
    const [moname, setMoname] = React.useState('');
    const [error, setError] = React.useState(false);
  
    const handleChange = () => {
      setOpen((open) => !open);
    };

    function getOrgName(moid) {
      const token = "MLY|9006973349373388|91a175c294e87cd0e18a346877811833"
    
      fetch(`https://graph.mapillary.com/${moid}?access_token=${token}&fields=name`)
      .then(function (response) {
          return response.json();
      })
      .then((response) => {
        setError(false)
        setMoname(response.name)
      })
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
        setMoname('')
        setError(true)
      });
    
    }
    
    return (
      <Box sx={{ marginLeft: 5, top: 80, zIndex: 10}} className="position-fixed">
        <Fab aria-label="filtro" className={`mapi-filter${open ? " enter" : ""}`}> 
          <SearchIcon onClick={handleChange} />
          <TextField className={`mapi-txtFilter${open ? " enter" : ""}`} id="standard-basic" 
            label="ID da Organização" variant="standard" value={props.mapilOID} 
            error={error}
            helperText={(moname !== '') ? moname : "Organização não encontrada"}
            FormHelperTextProps={{
              sx: {
                fontSize: "0.45rem",
                display: (open) ? "block" : "none"
              }
            }}
            onChange={(e) => {
              props.setMapilOID(e.target.value);
              getOrgName(e.target.value)
            }}/>
          <BackspaceIcon className={`mapi-BackspaceIcon${open ? " enter" : ""}`} onClick={() => {props.setMapilOID(''); setOpen(false)}}/>
        </Fab>
      </Box>
    );
  }