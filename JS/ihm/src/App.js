import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardEleves from './DashboardEleves';
import ContactPage from './ContactPage';
import DashboardProfs from "./DashboardProfs"; // Assurez-vous que le chemin est correct

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboardEleves" element={<DashboardEleves />} />
                <Route path="/DashboardProfs" element={<DashboardProfs />} />
            </Routes>
        </Router>
    );
} // Fin de la fonction App

export default App;
