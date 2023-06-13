import React, { useState, useEffect } from 'react';

//Button Icons
import { styled } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import StreetviewIcon from '@mui/icons-material/Streetview';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import HelpIcon from '@mui/icons-material/Help';

//Buttons and other toolbar components
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

//Modal
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';

//Import Export Button
import ExportPNGButton from '../../utils/ExportPNGButton';

//Button toogle style
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    '& .MuiToggleButtonGroup-grouped': {
      margin: theme.spacing(0.5),
      border: 0,
      '&.Mui-disabled': {
        border: 0,
      },
      '&:not(:first-of-type)': {
        borderRadius: theme.shape.borderRadius,
      },
      '&:first-of-type': {
        borderRadius: theme.shape.borderRadius,
      },
    },
}));

export default function ToolbarBasic(props) {

    //Handle Modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const rowsPerPage = 5
  
    const modalStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };
  
    //Table style
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
  
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));
  
    //Handle table pagination
    const [page, setPage] = React.useState(0);
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    return (
      <div>
          <Paper
              elevation={0}
              sx={{
              display: 'flex',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
              alignItems: 'center'
              }}
          >
              <StyledToggleButtonGroup
                  size="small"
                  value={props.basicOptions}
                  onChange={props.onBasicOptionsChange}
                  aria-label="basic options"
              >
                  <ToggleButton value="map" aria-label="map">
                      <MapIcon />
                  </ToggleButton>
                  <ToggleButton value="mapillary" aria-label="mapillary">
                      <StreetviewIcon />
                  </ToggleButton>
                  <ToggleButton value="bounds" aria-label="bounds">
                      <ZoomInMapIcon />
                  </ToggleButton>
              </StyledToggleButtonGroup>
              
              <TextField id="filled-basic" label="Título do Mapa" variant="filled" 
                value={props.titulo} onChange={props.onTituloChange} />
  
              <Divider orientation="vertical" variant="middle" sx={{ mx:1 }} flexItem />
              
              <FormControl variant="filled" sx={{ minWidth: 250 }}>
                <InputLabel id="select-var-filled-label">Atributo de Preenchimento</InputLabel>
                <Select
                  labelId="select-var-filled-label"
                  id="var-select-filled"
                  value={props.attribute}
                  onChange={props.onAttributeChange}
                >
                  <MenuItem value="">
                    <em>Nenhum</em>
                  </MenuItem>
                  {props.attrNames}
                </Select>
              </FormControl>
              
              <IconButton onClick={handleOpen}>
                <HelpIcon />
              </IconButton>

              <Divider orientation="vertical" variant="middle" sx={{ mx:1 }} flexItem />
              
              <ExportPNGButton map={props.map}/>

          </Paper>
  
          <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          >
            <Box sx={modalStyle}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Atributos da Camada
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  {!props.attributes ? '' : 
                      <TableContainer component={Paper}>
                      <Table size="small" aria-label="a dense table">
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Nome do Atributo</StyledTableCell>
                            <StyledTableCell>Descrição do Atributo</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(rowsPerPage > 0
                              ? props.attributes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              : props.attributes
                            ).map((attribute) => (
                              <StyledTableRow
                                key={attribute.pk}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {attribute.attribute_label}
                                </StyledTableCell>
                                <StyledTableCell align="right">{attribute.description}</StyledTableCell>
                              </StyledTableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                            <TablePagination 
                              count={props.attributes.length}
                              onPageChange={handleChangePage}
                              page={page}
                              rowsPerPage={5}
                              rowsPerPageOptions={[5]}
                            />
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  }
              </Typography>
            </Box>
          </Modal>
      </div>
      
    );
}