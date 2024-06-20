import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function LoginPage() {
    const [login, setLogin] = useState('');
    const [mdp, setMdp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (login === 'prof' && mdp === 'prof') {
            navigate('/dashboardProfs');
        } else if (login === 'eleve' && mdp === 'eleve') {
            navigate('/dashboardEleves');
        } else {
            alert('Login ou mot de passe incorrect');
        }
    };

    const handleContactClick = () => {
        navigate('/contact');
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
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1" align="center">
                    <Button variant="text" color="primary" onClick={handleContactClick}>
                        Contact
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
}

export default LoginPage;