import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

export default function (props) {
  const listAttributes = props.attributes.map((attribute) =>
    <ListItem key={attribute.attribute}>
      <Typography sx={{ fontSize: 14 , mr:2}} color="text.secondary" gutterBottom>
      {attribute.attribute_label}
      </Typography>
      <Typography variant="body2" id={'infomap_' + attribute.attribute}>
      </Typography>
    </ListItem>
  );

    return (
        <div className="info ol-control ol-tooltip-legend">
            <Card>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    
                    { (props.title != undefined && props.title !== '') &&
                      <ListItem key={1}>
                        <Typography sx={{ fontSize: 14 , mr:2}} color="text.secondary" gutterBottom>
                          {props.title.attribute_label}
                        </Typography>
                        <Typography variant="h5" component="div" id="attributeTitle_infomap">
                          
                        </Typography>
                      </ListItem>
                    }

                    {listAttributes}

                  </List>
            </Card>
        </div>
      );
}