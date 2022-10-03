import React, { useState, useEffect } from 'react';

import { styled } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

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
  const [basicOptions, setBasicOptions] = useState(() => ['map']);

  // const handleOptions = (event, newOptions) => {
  //   setBasicOptions(newOptions);
  // };

  // useEffect(() => {
  //   console.log(basicOptions)
  // }, [basicOptions])

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
                <ToggleButton value="zoom" aria-label="zoom">
                    <ZoomInIcon />
                </ToggleButton>
                <ToggleButton value="bounds" aria-label="bounds">
                    <ZoomOutMapIcon />
                </ToggleButton>
            </StyledToggleButtonGroup>
        </Paper>
    </div>
  );
}
