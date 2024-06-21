import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

// Créez un thème personnalisé
const theme = createTheme({
    palette: {
        primary: {
            main: '#77ddff', // Couleur principale (par exemple bleu)
        },
        secondary: {
            main: '#FF77B2', // Couleur secondaire (par exemple rouge)
        },
        info: {
            main: '#FF9C77', // Couleur d'information (par exemple vert)
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </React.StrictMode>
);
