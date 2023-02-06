import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        common: '#fff'
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        common: '#121212'
    },
});