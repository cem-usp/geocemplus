import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxHeight: '90%',
  overflow: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal() {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <img src='/logo_mapi.png' height="50px"/>MAPi em atualização
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Neste momento o sistema MAPi se encontra em atualização para uma nova versão. <br />
            Algumas funcionalidades podem estar temporariamente indisponíveis ou instáveis. <br />
            Agradecemos sua compreensão e paciência durante este processo. <br />
            Você pode acessar a versão experimental do novo MAPi através do link: <a href="https://web.mapi.orioro.design/" target="_blank" rel="noopener noreferrer">web.mapi.orioro.design</a>
            <br /><br />
            Em caso de dúvidas ou para mais informações acesse o site do projeto <a href="https://centrodametropole.fflch.usp.br/mapi" target="_blank" rel="noopener noreferrer">centrodametropole.fflch.usp.br/mapi</a> ou
            entre em contato com nossa equipe pelo email <a href="mailto:mapi.cem@usp.br">mapi.cem@usp.br</a>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
