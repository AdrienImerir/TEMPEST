import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function ContactPage() {
    const [userName, setUserName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Logique d'envoi d'email simulée
        console.log(`Envoyer un email à thomas.box@imerir.com`);
        console.log(`Nom: ${userName}`);
        console.log(`Message: ${message}`);

        // Simulation de l'envoi
        setIsSubmitted(true);
    };

    return (
        <Container maxWidth="sm">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Contactez-nous
                </Typography>
                {isSubmitted ? (
                    <Typography variant="body1" align="center" color="primary">
                        Merci pour votre message, nous vous répondrons bientôt.
                    </Typography>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Box my={2}>
                            <TextField
                                label="Votre nom"
                                fullWidth
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Message"
                                fullWidth
                                multiline
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                margin="normal"
                            />
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button variant="contained" color="primary" type="submit">
                                    Envoyer
                                </Button>
                            </Box>
                        </Box>
                    </form>
                )}
            </Box>
        </Container>
    );
}

export default ContactPage;