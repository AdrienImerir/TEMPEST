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
    TextField,
    Button,
    Tabs,
    Tab,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import Header from "./Header";

function DashboardProfs() {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);
    const [newNotes, setNewNotes] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [classes, setClasses] = useState([]);
    const [profId, setProfId] = useState(1); // ID du professeur, à ajuster selon votre logique d'authentification

    // Données fictives
    const fallbackClasses = [
        {
            id: 1, name: 'Classe A', students: [
                { id: 1, name: 'John Doe', notes: [12, 18, 14] },
                { id: 2, name: 'Jane Doe', notes: [19, 16, 15] },
                { id: 3, name: 'Sam Smith', notes: [17, 13, 15] },
                { id: 10, name: 'Chris Evans', notes: [15, 14, 19] },
                { id: 11, name: 'Mark Ruffalo', notes: [14, 18, 17] },
                { id: 12, name: 'Scarlett Johansson', notes: [13, 12, 15] }
            ]
        },
        {
            id: 2, name: 'Classe B', students: [
                { id: 4, name: 'Alice Jones', notes: [16, 11, 13] },
                { id: 5, name: 'Bob Brown', notes: [18, 16, 14] },
                { id: 6, name: 'Charlie Black', notes: [19, 17, 15] },
                { id: 13, name: 'Paul Rudd', notes: [16, 14, 13] },
                { id: 14, name: 'Jeremy Renner', notes: [17, 13, 18] },
                { id: 15, name: 'Chris Hemsworth', notes: [18, 16, 19] }
            ]
        },
        {
            id: 3, name: 'Classe C', students: [
                { id: 7, name: 'David White', notes: [20, 15, 15] },
                { id: 8, name: 'Eve Green', notes: [18, 17, 16] },
                { id: 9, name: 'Frank Blue', notes: [19, 16, 14] },
                { id: 16, name: 'Tom Holland', notes: [17, 14, 19] },
                { id: 17, name: 'Benedict Cumberbatch', notes: [18, 15, 13] },
                { id: 18, name: 'Brie Larson', notes: [19, 16, 18] }
            ]
        }
    ];

    useEffect(() => {
        // Remplacez par l'URL de votre API et les paramètres appropriés
        fetch('http://10.3.1.224:5000/api/eleves/notes?prenom=John&nom=Doe')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const formattedClasses = data.map(item => ({
                    id: item.eleve.classe_id,
                    name: item.eleve.classe,
                    students: [{
                        id: item.eleve.id,
                        name: `${item.eleve.prenom} ${item.eleve.nom}`,
                        notes: item.notes.map(note => note.note)
                    }]
                }));
                setClasses(formattedClasses);
            })
            .catch(error => {
                console.error('There was an error fetching the initial classes!', error);
                setClasses(fallbackClasses);
            });
    }, []);

    const handleNoteChange = (classId, studentId, note) => {
        setNewNotes((prevNotes) => ({
            ...prevNotes,
            [studentId]: note,
        }));
    };

    const handleNoteBlur = (classId, studentId, note) => {
        console.log('Saving note:', classId, studentId, note);
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleValidation = () => {
        const updatedNotes = Object.keys(newNotes).map(studentId => ({
            eleve_id: parseInt(studentId),
            note: parseFloat(newNotes[studentId])
        }));

        const requestBody = {
            prof_id: profId,
            classe_id: classes[tabIndex].id,
            matiere_id: 1, // ID de la matière, à ajuster selon votre logique
            notes: updatedNotes,
            commentaire: "" // Optionnel
        };

        fetch('http://10.3.1.224:5000/api/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Notes saved successfully:', data);
                // Mettez à jour les notes localement après la validation
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
            })
            .catch(error => {
                console.error('There was an error saving the notes!', error);
            });
    };

    const handleOpenDialog = (student) => {
        setSelectedStudent(student);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedStudent(null);
    };


    return (
        <Container>
            <Header appName="Scolar Sphère" logoSrc="/path/to/logo.png" />
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
                                        <TableCell>Actions</TableCell>
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
                                            <TableCell>
                                                <Button variant="contained" onClick={() => handleOpenDialog(student)}>
                                                    Bulletin
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                ))}
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="secondary" onClick={handleValidation}>
                        Valider notes
                    </Button>
                </Box>
            </Box>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Bulletin de {selectedStudent?.name}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Voici les notes de l'élève.
                    </DialogContentText>
                    {selectedStudent && (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Matière</TableCell>
                                        <TableCell>Note</TableCell>
                                        <TableCell>Appréciation</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedStudent.notes.map((note, index) => (
                                        <TableRow key={index}>
                                            <TableCell>Matière {index + 1}</TableCell>
                                            <TableCell>{note}</TableCell>
                                            <TableCell>{note >= 13 ? 'Bravo!' : 'Peut mieux faire'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
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
