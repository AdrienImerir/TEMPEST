import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardProfs from './DashboardProfs';
import DashboardEleves from './DashboardEleves';
import ForgetPassword from './ForgetPassword'; // Assurez-vous que le chemin est correct
import { createMuiTheme, ThemeProvider } from '@mui/material';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#76dfff"
        },
        secondary: {
            main: "#ff9c76"
        }
    }
})

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/forgetPassword" element={<ForgetPassword />} />
                    <Route path="/dashboardProfs" element={<DashboardProfs />} />
                    <Route path="/dashboardEleves" element={<DashboardEleves />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
