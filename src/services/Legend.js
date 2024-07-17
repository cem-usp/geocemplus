import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../config/Theme'

export default function LegendControl(props) {
    
    function Steps({fill}) {
        const colors = fill.getColors()
    
        return(
            colors.map((step) => {
                const intervalText = `${step.interval.start.toLocaleString("pt-BR", {maximumFractionDigits: 4})} ${(step.interval.start) ? '-' : ''} ${step.interval.end.toLocaleString("pt-BR", {maximumFractionDigits: 4})}`
                return(
                    <Tooltip title={intervalText}>
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
                            <Typography variant="body1" noWrap>
                                {intervalText}
                            </Typography>
                        </ListItem>
                    </Tooltip>
            )
        }))
    }

    const attributes_share = 12 / props.fills.length
    const legendLayers = props.fills.map((mapFill) => 
        <Grid item xs={attributes_share}>
            <Tooltip title={mapFill.attribute}>
                <Typography variant="body1" noWrap={true}>
                    {mapFill.attribute}
                </Typography>
            </Tooltip>
            <Steps fill={mapFill} />
        </Grid>
    )

    const [open, setOpen] = React.useState(false);
  
    const handleChange = () => {
        setOpen((open) => !open);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box className="ol-legend" sx={{right: (open) ? `-26vw` : '0vw' }}>
                <Grid container>
                    <Grid item style={{width: "20px"}} className="ol-legend-header">
                        <Paper elevation={4} >
                            <Typography variant="button" display="block" gutterBottom onClick={handleChange}>
                                Legendas
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item style={{width: "500px"}}>
                        <Paper elevation={4} >
                            <Grid container>
                                {legendLayers}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
		</ThemeProvider>
      );
}