import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';

function DashboardEleves() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'Eleve') {
            navigate('/');
        }
    }, [navigate]);

    const handleFetchData = () => {
        setIsLoading(true);
        setError(null);

        const user = JSON.parse(localStorage.getItem('user'));

        fetch(`http://localhost:5000/api/eleves/notes?prenom=${user.prenom}&nom=${user.nom}`, {
            method: 'GET',
            credentials: 'same-origin' // Inclure les cookies de session
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.erreur) {
                    throw new Error(data.erreur);
                }
                const formattedData = data.notes.map((note, index) => ({
                    id: index + 1,
                    subject: note.matiere,
                    maxNote: 20,
                    classNote: 15,
                    studentNote: note.note,
                    minNote: 10,
                    appreciation: 'Bien',
                }));
                setData(formattedData);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        fetch('http://localhost:5000/api/logout', { method: 'GET', credentials: 'include' });
        navigate('/');
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tableau de bord de l'élève
                </Typography>
                <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Button variant="contained" color="primary" onClick={handleFetchData}>
                        Charger les données
                    </Button>
                </Box>
                {isLoading && <div>Chargement...</div>}
                {error && <div>Erreur : {error.message}</div>}
                {!isLoading && !error && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Matière</TableCell>
                                    <TableCell>Note Max Classe</TableCell>
                                    <TableCell>Note Élève</TableCell>
                                    <TableCell>Note Min</TableCell>
                                    <TableCell>Appréciation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>{row.id}</TableCell>
                                        <TableCell>{row.subject}</TableCell>
                                        <TableCell>{row.maxNote}</TableCell>
                                        <TableCell>{row.studentNote}</TableCell>
                                        <TableCell>{row.minNote}</TableCell>
                                        <TableCell>{row.appreciation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default DashboardEleves;
