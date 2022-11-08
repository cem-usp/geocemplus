import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function LegendControl(props) {
    const colors = props.fill.getColors()

    const listSteps = colors.map((step) =>
        <ListItem>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: '2em',
                height: '2em',
                alignItems: 'center',
                },
            }}
            >
                <Paper elevation={3} sx={{backgroundColor: step.color}}/>
            </Box>
            <Typography variant="body1">
                {step.interval.start} - {step.interval.end}
            </Typography>
        </ListItem>
    );


    return (
        <div className="info ol-control ol-legend">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                { listSteps }
            </List>
        </div>
      );
}