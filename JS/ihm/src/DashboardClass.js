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

function DashboardClass() {
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0);

    const [newNote, setNewNote] = useState([]);

    const initialClasses = [
        { id: 1, name: 'Classe A', students: [{ id: 1, name: 'John Doe', note:[ 85, 66, 35] }, { id: 2, name: 'Jane Doe', note:[ 90,66, 35] }, { id: 3, name: 'Sam Smith', note:[ 78,66, 35] }] },
        { id: 2, name: 'Classe B', students: [{ id: 4, name: 'Alice Jones', note:[ 88,66, 35] }, { id: 5, name: 'Bob Brown', note:[ 82,66, 35] }, { id: 6, name: 'Charlie Black', note:[ 91,66, 35] }] },
        { id: 3, name: 'Classe C', students: [{ id: 7, name: 'David White', note:[ 79,66, 35] }, { id: 8, name: 'Eve Green', note:[ 85,66, 35] }, { id: 9, name: 'Frank Blue', note:[ 89,66, 35] }] }
    ];

    const [classes, setClasses] = useState(initialClasses);

    const handleNoteChange = (classId, studentId, newNote) => {
        setClasses((prevClasses) =>
            prevClasses.map((classData) =>
                classData.id === classId
                    ? {
                        ...classData,
                        students: classData.students.map((student) =>
                            student.id === studentId ? { ...student, note: newNote } : student
                        ),
                    }
                    : classData
            )
        );
        alert(classes[0].students[0].note);
    };

    const handleNoteBlur = (classId, studentId, newNote) => {
        // Sauvegarde de la note dans le JSON
        console.log('Saving note:', classId, studentId, newNote);
        let addedNote = false;
        setNewNote((newNote) => {
            newNote.map((studentNote) =>{
                if(studentNote.student===studentId){
                    studentNote.note=newNote;
                    addedNote = true;
                }
            });
            if(!addedNote){
                newNote.push({
                   student: studentId,
                   note: newNote 
                })
            }
    })

        // Ici vous pouvez ajouter la logique pour sauvegarder les données, par exemple une requête API
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleValidation = () => {
        
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
                                        {classData.students.map((note) =>(
                                            <TableCell>Notes</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classData.students.map((student) => (
                                        <TableRow key={student.id}>
                                            <TableCell>{student.name}</TableCell>
                                            {student.note.map((notesing) => (
                                                <TableCell>{notesing}</TableCell>
                                            ))}
                                            <TableCell>
                                                <TextField
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
                    <Button variant="contained" color="secondary" onClick={handleValidation}>
                        Valider note
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

export default DashboardClass;
