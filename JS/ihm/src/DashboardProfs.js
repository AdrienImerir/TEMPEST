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

    const initialClasses = [
        { id: 1, name: 'Classe A', students: [{ id: 1, name: 'John Doe', note: 85 }, { id: 2, name: 'Jane Doe', note: 90 }, { id: 3, name: 'Sam Smith', note: 78 }] },
        { id: 2, name: 'Classe B', students: [{ id: 4, name: 'Alice Jones', note: 88 }, { id: 5, name: 'Bob Brown', note: 82 }, { id: 6, name: 'Charlie Black', note: 91 }] },
        { id: 3, name: 'Classe C', students: [{ id: 7, name: 'David White', note: 79 }, { id: 8, name: 'Eve Green', note: 85 }, { id: 9, name: 'Frank Blue', note: 89 }] }
    ];

    const initialClassesProf = {
        classes: [
            "3°A","3°B","3°C","5°B"
        ]
    }

    const [classes, setClasses] = useState(initialClasses);

    const [classesProf, setClassesProf]= useState(initialClassesProf)
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
    };

    const handleChangeToClass = (classe) => {
            if(classe === "3°A"){
            navigate('/dashboardClasses');
            }
            else if(classe === "3°B"){
            navigate('/dashboardVertical');
            }
            
    };

    const handleNoteBlur = (classId, studentId, newNote) => {
        // Sauvegarde de la note dans le JSON
        console.log('Saving note:', classId, studentId, newNote);
        // Ici vous pouvez ajouter la logique pour sauvegarder les données, par exemple une requête API
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
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
                    <TabPanel>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Classes</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {classesProf.classes.map((classe) => (
                                        <TableRow key={classe}>
                                            <TableCell><Button variant="contained" color="secondary" value={classe} onClick={() => handleChangeToClass(classe)}>{classe}</Button></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Déconnexion
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
