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
import Header from "./Header";

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

        fetch(`http://10.3.1.224:5000/api/eleves/notes?prenom=${user.prenom}&nom=${user.nom}`, {
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

                // Combine les données pour chaque matière
                const combinedData = data.notes.map(note => {
                    const maxNote = data.notes_max.find(max => max.matiere === note.matiere);
                    const minNote = data.notes_min.find(min => min.matiere === note.matiere);
                    const commentaire = data.commentaires.find(comm => comm.matiere === note.matiere);

                    return {
                        matiere: note.matiere,
                        note: note.note,
                        professeur: note.professeur,
                        maxNote: maxNote ? maxNote.note_max : null,
                        minNote: minNote ? minNote.note_min : null,
                        appreciation: commentaire ? commentaire.commentaire : 'N/A',
                    };
                });

                setData(combinedData);
                setIsLoading(false);
            })
            .catch(error => {
                setError(error);
                setIsLoading(false);
            });
    };

    return (
        <Container>
            <Header appName="Scolar Sphère" logoSrc="/path/to/logo.png" />
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tableau de bord de l'élève
                </Typography>
                <Box display="flex" justifyContent="center" mt={2} mb={2}>
                    <Button variant="contained" color="secondary" onClick={handleFetchData}>
                        Mise à jour des notes
                    </Button>
                </Box>
                {isLoading && <div>Chargement...</div>}
                {error && <div>Erreur : {error.message}</div>}
                {!isLoading && !error && (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Matière</TableCell>
                                    <TableCell>Note Max Classe</TableCell>
                                    <TableCell>Note Élève</TableCell>
                                    <TableCell>Note Min</TableCell>
                                    <TableCell>Appréciation</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.matiere}</TableCell>
                                        <TableCell>{row.maxNote}</TableCell>
                                        <TableCell>{row.note}</TableCell>
                                        <TableCell>{row.minNote}</TableCell>
                                        <TableCell>{row.appreciation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Container>
    );
}

export default DashboardEleves;
