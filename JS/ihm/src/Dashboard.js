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
    TextField,
    Button,
} from '@mui/material';

function Dashboard() {
    const navigate = useNavigate();
    const [data, setData] = useState([
        { id: 1, name: 'John Doe', note: 15 },
        { id: 2, name: 'Jane Doe', note: 11 },
        { id: 3, name: 'Sam Smith', note: 10 },
    ]);

    const handleNoteChange = (id, newNote) => {
        setData((prevData) =>
            prevData.map((row) =>
                row.id === id ? { ...row, note: newNote } : row
            )
        );
    };

    const handleNoteBlur = (id, newNote) => {
        // Sauvegarde de la note dans le JSON
        console.log('Saving note:', id, newNote);
        // Ici vous pouvez ajouter la logique pour sauvegarder les données, par exemple une requête API
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tableau de bord
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nom</TableCell>
                                <TableCell>Note</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        <TextField
                                            value={row.note}
                                            onChange={(e) => handleNoteChange(row.id, e.target.value)}
                                            onBlur={(e) => handleNoteBlur(row.id, e.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Dashboard;
