import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function LoginPage() {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (login === 'admin' && mdp === 'admin') {
            navigate('/dashboard');
        } else {
            alert('Login ou mot de passe incorrect');
        }
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
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Valider
                        </Button>
                    </Box>
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

export default LoginPage;
