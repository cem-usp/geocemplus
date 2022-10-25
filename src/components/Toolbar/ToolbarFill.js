import React from 'react';

//Buttons and other toolbar components
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Slider } from '@mui/material';

export default function ToolbarFill() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Paper
              elevation={0}
              sx={{
              display: 'flex',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
              }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mx:2 }}>
                    <Typography variant="h6">
                        Preenchimento
                    </Typography>
                </Box>
                
                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-method-filled-label">Classificação</InputLabel>
                    <Select
                    labelId="select-method-filled-label"
                    id="method-select-filled"
                    value='quantile'
                    >
                    <MenuItem value="quantile">
                        Quantil
                    </MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', alignItems: 'center', mx:2, width: 70 }}>
                    <Slider
                        aria-label="Número de Classes"
                        defaultValue={5}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={5}
                        max={7}
                    />
                </Box>

                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-scheme-filled-label">Esquema de Cores</InputLabel>
                    <Select
                    labelId="select-scheme-filled-label"
                    id="scheme-select-filled"
                    value='sequential'
                    >
                    <MenuItem value="sequential">
                        Sequencial
                    </MenuItem>
                    <MenuItem value="diverging">
                        Divergente
                    </MenuItem>
                    <MenuItem value="qualitative">
                        Qualitativo
                    </MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="filled"  sx={{ minWidth: 120 }}>
                    <InputLabel id="select-palette-filled-label">Paleta de Cores</InputLabel>
                    <Select
                    labelId="select-palette-filled-label"
                    id="palette-select-filled"
                    value='sequential'
                    >
                        <MenuItem value="GREEN" className='pallete'>
                           <Box sx={{backgroundColor: '#003828'}}></Box>
                        </MenuItem>
                    </Select>
                </FormControl>

            </Paper>
        </Box>
    )
}