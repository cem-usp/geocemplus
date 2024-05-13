import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';

export const theme = createTheme(
    {
        palette: {
            primary: { main: '#1976d2' },
        },
        typography: {
            body1: {
              fontSize: '0.875rem',
            },
          },
    },
    ptBR,
);