import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LanguageIcon from '@mui/icons-material/Language';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

const LinkBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: 1,
  gridTemplateColumns: 'repeat(2, 1fr)'
}))

const LinkBoxItem = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))

const LogoCEMBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

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
          <Typography variant="body1" component="div" sx={{ flexGrow: 1, textAlign: 'left'}}>
            <img src='/logo_mapi.png' height="50px"/>
            MAPi
          </Typography>
          <LinkBox sx={{ typography: 'body1' }}>
            <LinkBoxItem><a href="https://web.mapi.orioro.design/" target='_self'><b>Novo Mapi (beta)</b></a></LinkBoxItem>
            <LinkBoxItem><a href="https://centrodametropole.fflch.usp.br/pt-br/sistemas-interativos" target='_blank'>Sistemas Interativos</a></LinkBoxItem>
            <LinkBoxItem><a href="/manual_mapi_v1.1.1.pdf" target='_blank'>Manual do Usuário</a></LinkBoxItem>
            <div><a href="mailto:suporte.cem@usp.br?subject=[MAPi]">suporte.cem@usp.br</a></div>
            {/* <div><LanguageIcon />Português (Brasil)</div> */}
          </LinkBox>
          {/* <Box sx={{ typography: 'body1', mx: 2}}>
            <a href="https://geocem.centrodametropole.fflch.usp.br/" target='_blank'><img src='/logo_geocem.png'/></a>
          </Box> */}
          <LogoCEMBox sx={{mr: 2}}>
            <a href="https://centrodametropole.fflch.usp.br/pt-br/" target='_blank'><img src='/logo_cem.png'/></a>
          </LogoCEMBox>
        </Toolbar>
      </AppBar>
    </Box>
  );
}