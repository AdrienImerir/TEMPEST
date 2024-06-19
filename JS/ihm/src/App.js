import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function App() {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');
    const email = 'support-IT@gmail.com';
    const email2 = 'support-IT@gmail.com';
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        // Remplacez cette partie par votre requête API
        console.log('Login:', login);
        console.log('Mot de passe:', mdp);
        // Votre requête API ici
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    CheckNote
                </Typography>
                <Box my={2}>
                    <TextField
                        label="Login"
                        fullWidth
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        value={mdp}
                        onChange={(e) => setMdp(e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Valider
                    </Button>
                </Box>
            </Box>
            <Box align="right" mt={4}>
                <Button variant="outlined" onClick={handleClickOpen}>
                    CONTACT
                </Button>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Use Google's location service?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            mail
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>FERMER</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
}

export default App;
