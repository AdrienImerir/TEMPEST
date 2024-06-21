import React from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

// Fonction pour générer des noms aléatoires
function generateRandomName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry'];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

function createData(classe) {
    return { classe };
}

// Exemple de données avec 6 lignes
const rows = Array.from({ length: 6 }, (_, index) => createData(`Classe ${index + 1}`));

function DashboardClasseProviseur() {
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/dashboardProviseur');  // Retour à la page Dashboard Proviseur
    };

    const handleDeconnexionClick = () => {
        navigate('/');  // Naviguer vers la page de connexion (LoginPage)
    };

    const handleModifyClick = (selectedClass) => {
        navigate('/DashboardPPchange', { state: { selectedClass } });
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
                    width: '80%', 
                    marginTop: 2 
                }}
            >
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Classe</TableCell>
                                <TableCell>Professeur Principal</TableCell>
                                <TableCell>Bulletin</TableCell>
                                <TableCell>Action</TableCell> {/* Nouvelle colonne pour l'action */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell component="th" scope="row">
                                        {row.classe}
                                    </TableCell>
                                    <TableCell>
                                        Professeur Principal
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox
                                            checked={false}  // Ici, false signifie non cochée
                                            color="default"  // Couleur de base de la checkbox (peut être 'primary', 'secondary' ou 'default')
                                            sx={{ color: 'red' }}  // Couleur du style personnalisé
                                            disabled  // Désactivé (non modifiable)
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => handleModifyClick(row.classe)}
                                        >
                                            Modifier
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    width: '100%', 
                    marginTop: 2 
                }}
            >
                <Stack spacing={2} direction="row">
                    <Button variant="contained" onClick={handleBackClick}>
                        Retour
                    </Button>
                    <Button variant="outlined" onClick={handleDeconnexionClick}>
                        Déconnexion
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

export default DashboardClasseProviseur;
