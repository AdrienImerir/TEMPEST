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
    const [data, setData] = useState([
        { id: 1, subject: 'Math', maxNote: 20, classNote: 15, studentNote: 18, minNote: 10, appreciation: 'Très bien' },
        { id: 2, subject: 'Science', maxNote: 20, classNote: 16, studentNote: 17, minNote: 12, appreciation: 'Bien' },
        { id: 3, subject: 'History', maxNote: 20, classNote: 14, studentNote: 19, minNote: 11, appreciation: 'Excellent' },
    ]);

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tableau de bord de l'élève
                </Typography>
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
