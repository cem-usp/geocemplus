import React, { useState } from "react";
import { styled } from '@mui/material/styles';

//Modal
import Paper from '@mui/material/Paper';
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
import Box from '@mui/material/Box';


export default function ModalAttributes(props) {
    //Handle Attributes Modal
    const rowsPerPage = 5
  
    const modalStyle = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60%',
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
        <Modal
            open={props.open}
            onClose={props.close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >   
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                <b>Camada</b> {props.layerModal.title}
            </Typography>
            <p>
              {props.layerModal.raw_abstract}
            </p>
            <p>
              <a href={props.layerModal.detail_url} target="_blank">Mais recursos da camada</a>
            </p>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
                            ? props.layerModal.attribute_set.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : props.layerModal.attribute_set
                            ).map((attribute) => (
                            <StyledTableRow
                                key={attribute.pk}
                            >
                                <StyledTableCell component="th" scope="row">
                                {attribute.attribute_label}
                                </StyledTableCell>
                                <StyledTableCell align="left">{attribute.description}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                        <TableFooter>
                            <TablePagination 
                            count={props.layerModal.attribute_set.length}
                            onPageChange={handleChangePage}
                            page={page}
                            rowsPerPage={5}
                            rowsPerPageOptions={[5]}
                            />
                        </TableFooter>
                    </Table>
                    </TableContainer>
            </Typography>
          </Box>
          
        </Modal>
    )
}