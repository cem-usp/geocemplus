import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';

import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

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

export default function Toolbar(props) {

  return (
    <div>
        <Paper
            elevation={0}
            sx={{
            display: 'flex',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            flexWrap: 'wrap',
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
                {/* <ToggleButton value="zoom" aria-label="zoom">
                    <ZoomInIcon />
                    <ZoomOutIcon />
                </ToggleButton> */}
                <ToggleButton value="bounds" aria-label="bounds">
                    <ZoomInMapIcon />
                </ToggleButton>
            </StyledToggleButtonGroup>
            <TextField id="filled-basic" label="Título" variant="filled" 
              value={props.titulo} onChange={props.onTituloChange}/>

        </Paper>
    </div>
  );
}
