import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

export default function LegendAtInfo(props) {
    return (
        <div className="info ol-control ol-tooltip-legend">
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  
                  <ListItem key={1}>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                      TEC2_NOM
                    </Typography>
                    <Typography variant="h5" component="div">
                      ITAQUERA
                    </Typography>
                  </ListItem>

                </List>
                </CardContent>
            </Card>
        </div>
      );
}