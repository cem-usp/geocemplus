import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="transparent" sx={{bgcolor: 'rgba(255, 255, 255, 0.7)'}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={props.handleOpenBars}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'left'}}>
            <img src='/logo_mapi.png' height="50px"/>
            MAPi
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gap: 1,
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <div>Fale Conosco</div>
            <div>Sistemas Interativos</div>
            <div>Copyright</div>
            <div><LanguageIcon />Português (Brasil)</div>
          </Box>
          <Box sx={{mx: 2}}>
            <img src='/logo_geocem.png'/>
          </Box>
          <Box sx={{mr: 2}}>
            <img src='/logo_cem.png'/>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}