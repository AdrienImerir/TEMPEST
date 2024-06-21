import React, { useState, useEffect } from 'react';
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
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import Header from "./Header";

function DashboardAdmin() {
    const [users, setUsers] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [newUser, setNewUser] = useState({ username: '', password: '', role: '' });

    useEffect(() => {
        // Remplacez par l'URL de votre API pour récupérer les utilisateurs
        fetch('http://10.3.1.224:5000/api/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
            })
            .catch(error => {
                console.error('There was an error fetching the users!', error);
            });
    }, []);

    const handleOpenEditDialog = (user) => {
        setSelectedUser(user);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedUser(null);
        setNewPassword('');
    };

    const handleOpenAddDialog = () => {
        setOpenAddDialog(true);
    };

    const handleCloseAddDialog = () => {
        setOpenAddDialog(false);
        setNewUser({ username: '', password: '', role: '' });
    };

    const handleSavePassword = () => {
        fetch('http://10.3.1.224:5000/api/users/update-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: selectedUser.id, new_password: newPassword })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Password updated successfully:', data);
                handleCloseEditDialog();
            })
            .catch(error => {
                console.error('There was an error updating the password!', error);
            });
    };

    const handleAddUser = () => {
        fetch('http://10.3.1.224:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
            .then(response => response.json())
            .then(data => {
                console.log('User added successfully:', data);
                setUsers([...users, data]);
                handleCloseAddDialog();
            })
            .catch(error => {
                console.error('There was an error adding the user!', error);
            });
    };

    return (
        <Container>
            <Header appName="Scolar Sphère" logoSrc="/path/to/logo.png" />
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard Admin
                </Typography>
                <Button variant="contained" color="secondary" onClick={handleOpenAddDialog}>
                    Ajouter un nouvel utilisateur
                </Button>
                <TableContainer component={Paper} style={{ marginTop: 20 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nom d'utilisateur</TableCell>
                                <TableCell>Rôle</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => handleOpenEditDialog(user)}
                                        >
                                            Modifier le mot de passe
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
                <DialogTitle>Modifier le mot de passe</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nouveau mot de passe"
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditDialog} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={handleSavePassword} color="secondary">
                        Sauvegarder
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
                <DialogTitle>Ajouter un nouvel utilisateur</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nom d'utilisateur"
                        fullWidth
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                    <TextField
                        label="Rôle"
                        fullWidth
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddDialog} color="primary">
                        Annuler
                    </Button>
                    <Button onClick={handleAddUser} color="primary">
                        Ajouter
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default DashboardAdmin;
