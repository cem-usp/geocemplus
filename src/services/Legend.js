import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Control from 'ol/control/Control';

export default function LegendControl(props) {
    return (
        <div className="info ol-control ol-legend">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.palette}/>
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Work"/>
            </ListItem>
            <ListItem>
                <ListItemAvatar>
                <Avatar>
                </Avatar>
                </ListItemAvatar>
                <ListItemText primary="Vacation"/>
            </ListItem>
            </List>
        </div>
      );
}