import React, { useState } from 'react';
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

    const handleFetchData = () => {
        setIsLoading(true);
        setError(null);

        fetch('http://10.3.1.224:5000/api/eleves/notes?prenom=John&nom=Doe')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                const formattedData = data.notes.map((note, index) => ({
                    id: index + 1,
                    subject: note.matiere,
                    maxNote: 20, // Si vous avez des valeurs spécifiques, utilisez-les
                    classNote: 15, // Si vous avez des valeurs spécifiques, utilisez-les
                    studentNote: note.note,
                    minNote: 10, // Si vous avez des valeurs spécifiques, utilisez-les
                    appreciation: 'Bien', // Si vous avez des valeurs spécifiques, utilisez-les
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
