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
    Tabs,
    Tab,
} from '@mui/material';

function DashboardProfs() {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const [newNotes, setNewNotes] = useState({}); // Store new notes temporarily

    const initialClasses = [
        { id: 1, name: 'Classe A', students: [{ id: 1, name: 'John Doe', notes: [85, 66, 35] }, { id: 2, name: 'Jane Doe', notes: [90, 66, 35] }, { id: 3, name: 'Sam Smith', notes: [78, 66, 35] }] },
        { id: 2, name: 'Classe B', students: [{ id: 4, name: 'Alice Jones', notes: [88, 66, 35] }, { id: 5, name: 'Bob Brown', notes: [82, 66, 35] }, { id: 6, name: 'Charlie Black', notes: [91, 66, 35] }] },
        { id: 3, name: 'Classe C', students: [{ id: 7, name: 'David White', notes: [79, 66, 35] }, { id: 8, name: 'Eve Green', notes: [85, 66, 35] }, { id: 9, name: 'Frank Blue', notes: [89, 66, 35] }] }
    ];

    const [classes, setClasses] = useState(initialClasses);

    const handleNoteChange = (classId, studentId, note) => {
        setNewNotes((prevNotes) => ({
            ...prevNotes,
            [studentId]: note,
        }));
    };

    const handleNoteBlur = (classId, studentId, note) => {
        // Sauvegarde de la note dans le JSON
        console.log('Saving note:', classId, studentId, note);
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleValidation = () => {
        console.log('New notes:', newNotes);
        setClasses((prevClasses) =>
            prevClasses.map((classData) => ({
                ...classData,
                students: classData.students.map((student) => ({
                    ...student,
                    notes: [...student.notes, newNotes[student.id] || 'abs'],
                })),
            }))
        );
        setNewNotes({}); // Reset new notes after validation
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tableau de bord
                </Typography>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    {classes.map((classData, index) => (
                        <Tab key={index} label={classData.name} />
                    ))}
                </Tabs>
                {classes.map((classData, index) => (
                    <TabPanel key={index} value={tabIndex} index={index}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nom</TableCell>
                                        {classData.students[0].notes.map((_, i) => (
                                            <TableCell key={i}>Note {i + 1}</TableCell>
                                        ))}
                                        <TableCell>Nouvelle Note</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classData.students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.name}</TableCell>
                                            {student.notes.map((note, i) => (
                                                <TableCell key={i}>{note}</TableCell>
                                            ))}
                                            <TableCell>
                                                <TextField
                                                    onChange={(e) => handleNoteChange(classData.id, student.id, e.target.value)}
                                                    onBlur={(e) => handleNoteBlur(classData.id, student.id, e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                ))}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleValidation}>
                        Valider notes
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}

export default DashboardProfs;
