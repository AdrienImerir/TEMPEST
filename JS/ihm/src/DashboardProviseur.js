import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

function DashboardProviseur() {
    const navigate = useNavigate();

    const handleClasseClick = () => {
        navigate('/DashboardClasseProviseur');  // Naviguer vers la page /DashboardClasseProviseur
    };

    const handleAjouterProfClick = () => {
        // Ajouter la logique de navigation ou de traitement pour le bouton "Ajouter un Prof Principal"
    };

    const handleDeconnexionClick = () => {
        navigate('/');  // Naviguer vers la page de connexion (LoginPage)
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                height: '100vh', 
                padding: 2 
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexGrow: 1 
                }}
            >
                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={handleClasseClick}>
                        Classe
                    </Button>
                    <Button variant="contained" onClick={handleAjouterProfClick}>
                        Ajouter un Prof Principal
                    </Button>
                </Stack>
            </Box>
            <Button variant="outlined" onClick={handleDeconnexionClick} sx={{ marginBottom: 2 }}>
                Déconnexion
            </Button>
        </Box>
    );
}

export default DashboardProviseur;
