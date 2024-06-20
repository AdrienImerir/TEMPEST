import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Box } from '@mui/material';

function ContactPage() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" align="center" component="h1" gutterBottom>
                    Vous avez oublié votre mot de passe ?
                </Typography>
                <Typography variant="body1" align="center">
                    Dans ce cas, vous devez vous adresser au référent de votre établissement pour qu'il puisse vous le changer.
                </Typography>
            </Box>
            <Box mt={4} display="flex" justifyContent="center">
                <Typography variant="body1" align="center">
                    <Button variant="text" color="secondary" onClick={handleLoginClick}>
                        Retour à la page connexion
                    </Button>
                </Typography>
            </Box>
        </Container>
    );
}

export default ContactPage;