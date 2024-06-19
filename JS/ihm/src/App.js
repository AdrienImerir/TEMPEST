import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
function App() {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');

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
                    Nom de l'app
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
            <Box mt={4}>
                <Typography variant="body1" align="center">
                    Contact
                </Typography>
            </Box>
        </Container>
    );
}

export default App;
