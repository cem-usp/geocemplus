import { styled } from '@mui/material/styles';
import List from '@mui/material/List';

 
 export const NavList = styled(List)(({ theme }) => ({
        width: '350px',
        [theme.breakpoints.up('sm')]: {
            width: '384px',
        },
    }))