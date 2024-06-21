import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DashboardPPchange() {
    const navigate = useNavigate();
    const location = useLocation();

    // État local pour la classe sélectionnée et le nom modifié
    const [selectedClass, setSelectedClass] = useState(location.state ? location.state.selectedClass : '');
    const [modifiedName, setModifiedName] = useState('');

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();
        // Mettre à jour le nom correspondant à la classe sélectionnée
        // Vous pouvez implémenter la logique pour mettre à jour vos données ici
        alert(`Nom modifié pour la classe ${selectedClass}: ${modifiedName}`);
        // Redirection vers le tableau principal (DashboardClasseProviseur)
        navigate('/DashboardClasseProviseur');
    };

    const handleCancelClick = () => {
        // Annuler et revenir au tableau principal (DashboardClasseProviseur)
        navigate('/DashboardClasseProviseur');
    };

    return (
        <Box 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                padding: 2 
            }}
        >
            <Typography variant="h5" gutterBottom>
                Modifier le nom pour la classe {selectedClass}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2} direction="column">
                    <input
                        type="text"
                        value={modifiedName}
                        onChange={(e) => setModifiedName(e.target.value)}
                        placeholder="Entrez le nouveau nom"
                        required
                    />
                    <Stack spacing={2} direction="row">
                        <Button type="submit" variant="contained" color="primary">
                            Valider
                        </Button>
                        <Button variant="outlined" onClick={handleCancelClick}>
                            Annuler
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Box>
    );
}

export default DashboardPPchange;
