import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardProfs from './DashboardProfs';
import DashboardEleves from './DashboardEleves';
import DashboardProviseur from './DashboardProviseur';
import ContactPage from './ContactPage'; // Assurez-vous que le chemin est correct
import DashboardClasseProviseur from './DashboardClasseProviseur';
import DashboardPPchange from './DashboardPPchange';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/dashboardProfs" element={<DashboardProfs />} />
                <Route path="/dashboardEleves" element={<DashboardEleves />} />
                <Route path="/dashboardProviseur" element={<DashboardProviseur />} />
                <Route path="/DashboardClasseProviseur" element={<DashboardClasseProviseur />} />
                <Route path="/DashboardPPchange" element={<DashboardPPchange />} />
            </Routes>
        </Router>
    );
} // Fin de la fonction App

export default App;
