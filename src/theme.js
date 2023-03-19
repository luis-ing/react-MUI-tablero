import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        common: '#fff',
        primary: {
            main: '#0f5dbc',
        },
        background: {
            default: '#f8f8f8',
        },
        action: {
            hover: '#9494a13d'
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        common: '#202b46',
        background: {
            default: '#1e1e2d',
            paper: '#2b2b40'
        },
        action: {
            hover: '#9494a13d'
        },
        divider: '#27273a'
    },
});

// 19253d