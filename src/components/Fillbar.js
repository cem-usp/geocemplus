import React, { useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import {filterNumberAttributes} from '../utils/UtilFunctions'
import MenuItem from '@mui/material/MenuItem';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Slider from '@mui/material/Slider';

import FormControl from '@mui/material/FormControl';
import SelectPalette from './subcomponents/SelectPalette' 

//Select of Attributes to Tooltip
import SelectAttributes from './subcomponents/SelectAttributes';

import { styled } from '@mui/material/styles';

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
import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';

export default function Fillbar(props) {
    const [attrList, setAttrList] = useState(null)
    const [filterAttrNames, setFilterAttrNames] = useState(null)
    useEffect(() => {
		const list = (props.attributes) ? props.attributes.map((attribute) =>
						<MenuItem key={attribute.pk} value={attribute}>{attribute.attribute_label}</MenuItem>
						) : null;
		
		const filtered_attributes = (props.attributes) ? filterNumberAttributes(props.attributes) : null
		const filtered_names = (filtered_attributes) ? filtered_attributes.map((attribute) =>
									<MenuItem key={attribute.pk} value={attribute.attribute}>{attribute.attribute_label}</MenuItem>
									) : null;
		
		setAttrList(list)
      	setFilterAttrNames(filtered_names)
    },[props.attributes])

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(!open);
      };

    // Customized Button Group for Menu
    const MenuToogleBtn = styled(ToggleButton)({
        '&.MuiToggleButton-root': {
            fontSize: '0.6125rem'
        }
    })

    //Handle Attributes Modal
    const [openAM, setOpenAM] = React.useState(false);
    const handleOpenAM = () => setOpenAM(true);
    const handleCloseAM = () => setOpenAM(false);
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
        <Box sx={{ display: 'flex', zIndex:  10,
                         mt: '27vh', ml: '10px'}}
                 className="position-fixed">
                <Paper elevation={0} sx={{ bgcolor: '#042E6F', color: 'white' }} >
                    <List
                        sx={{width: '20vw'}}
                        component="nav"
                    >
                        {/* Menu de Preenchimento */}
                        <ListItemButton onClick={() => handleClickOpen()}>
                            <ListItemText primary='Preenchimento' />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ bgcolor: 'white', maxHeight: '62vh', overflow: 'auto' }}>
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:5 }}>
                                    Atributo de Preenchimento
                                </InputLabel>
                                <Select
                                    sx={{ mb: 1 }}
                                    displayEmpty
                                    value={props.fill_attribute}
                                    onChange={props.changeFAttribute}
                                    renderValue={(selected) => {
                                        if(selected === '') {
                                            return <em>Selecione um atributo</em>
                                        } else {
                                            return selected.attribute_label
                                        }
                                    }}
                                >
                                    <MenuItem disabled value="">
                                        <em>Selecione um atributo</em>
                                    </MenuItem>
                                    {attrList}
                                </Select>
                                
                                {/* Abre o modal de Atributos */}
                                <IconButton onClick={handleOpenAM}>
                                    <HelpIcon />
                                </IconButton>

                                <Modal
                                open={openAM}
                                onClose={handleCloseAM}
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

                                {/* Método de Classificação */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Classificação
                                </InputLabel>
                                <Container maxWidth="sm">
                                    <ToggleButtonGroup sx={{mb: 2}}
                                        exclusive
                                        onChange={props.changeMethod}
                                        value={props.method}
                                    >
                                        <MenuToogleBtn size='small' value="quantile">Quantil</MenuToogleBtn>
                                        <MenuToogleBtn size='small' value="jenks">Quebras Naturais (Jenks)</MenuToogleBtn>
                                    </ToggleButtonGroup>
                                </Container>

                                {/* Nº de Classes */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Número de classes
                                </InputLabel>
                                <Container maxWidth="sm" sx={{width:'200px'}}>
                                    <Slider
                                        aria-label="Número de Classes"
                                        defaultValue={5}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={5}
                                        max={7}
                                        value={props.n_classes}
                                        onChange={props.changeNClasses}
                                    />
                                </Container>

                                {/* Método de Classificação */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Esquema de cores
                                </InputLabel>
                                <Container maxWidth="sm">
                                    <ToggleButtonGroup sx={{mb: 2}} 
                                        size='small'
                                        exclusive
                                        onChange={props.changeCScheme}
                                        value={props.color_scheme}
                                    >
                                        <MenuToogleBtn value="sequential">Sequencial</MenuToogleBtn>
                                        <MenuToogleBtn value="diverging">Divergente</MenuToogleBtn>
                                        <MenuToogleBtn value="qualitative">Qualitativo</MenuToogleBtn>
                                    </ToggleButtonGroup>
                                </Container>

                                {/* Paleta de Cores */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Paleta de cores
                                </InputLabel>
                                <Container maxWidth="sm" sx={{pb: 3}}>
                                    <SelectPalette 
                                        scheme={props.color_scheme}
                                        setPalette={props.setPalette}
                                        steps={props.n_classes}
                                        handlePaletteChange={props.changePallete}
                                        palette={props.palette}
                                    />
                                </Container>

                                {/* Legenda flutuante */}
                                <InputLabel sx={{ textAlign: 'left', color: 'black', py: 1, ml:3 }}>
                                    Legenda Flutuante
                                </InputLabel>
                                {/* Atributo título */}
                                <FormControl variant="filled" maxWidth="sm" sx={{pb: 3}}>
                                    <InputLabel id="select-title-var-filled-label">Atributo Título</InputLabel>
                                    <Select
                                    labelId="select-title-var-filled-label"
                                    id="title-var-select-filled"
                                        sx={{ minWidth: 200, mb: 1 }}
                                        displayEmpty
                                        value={props.attributeTitle}
                                        onChange={props.onAttributeTitleChange}
                                        renderValue={(selected) => selected.attribute_label}
                                    >
                                        {props.attrList}
                                    </Select>
                                </FormControl>
                                {/* Atributos da legenda */}
                                <SelectAttributes
                                    attributes={props.attributes}
                                    attributesLF={props.attributesLF}
                                    handleALFChange={props.handleALFChange}
                                />
                            </Box>
                        </Collapse>
                     </List>
                </Paper>
        </Box>
    )
}