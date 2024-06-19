import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardProfs from './DashboardProfs';
import DashboardEleves from './DashboardEleves';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboardProfs" element={<DashboardProfs />} />
                <Route path="/dashboardEleves" element={<DashboardEleves />} />
            </Routes>
        </Router>
    );
}

export default App;
