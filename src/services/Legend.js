import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import Slide from '@mui/material/Slide';

export default function LegendControl(props) {
    const colors = props.fill.getColors()

    const listSteps = colors.map((step) =>
        <ListItem key={step.interval.start+'_'+step.interval.end}>
            <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                '& > :not(style)': {
                m: 1,
                width: '1.5em',
                height: '1.5em',
                alignItems: 'center',
                },
            }}
            >
                <i style={{backgroundColor: step.color}}/>
            </Box>
            <Typography variant="body1">
                {step.interval.start.toLocaleString("pt-BR", {maximumFractionDigits: 4})} {(step.interval.start) ? '-' : '' } {step.interval.end.toLocaleString("pt-BR", {maximumFractionDigits: 4})}
            </Typography>
        </ListItem>
    );

    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef(null);
  
    const handleChange = () => {
        containerRef.current.classList.toggle('enter')
        setOpen((open) => !open);
    };

    return (
        <Grid container className="ol-legend" ref={containerRef}>
            <Grid item xs={1} className="ol-legend-header">
                <Paper elevation={4} >
                    <Typography variant="button" display="block" gutterBottom onClick={handleChange}>
                        Legendas
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={11} >
                <List sx={{ bgcolor: 'background.paper' }}>
                    { listSteps }
                </List>
            </Grid>
        </Grid>
      );
}