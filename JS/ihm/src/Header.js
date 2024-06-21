import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        fetch('http://10.3.1.224:5000/api/logout')
            .then(() => {
                navigate('/');
            })
            .catch(error => {
                console.error('There was an error logging out!', error);
            });
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Box display="flex" alignItems="center" flexGrow={1}>
                    <img src="logo512.png" alt="logo" style={{ height: 40, marginRight: 16 }} />
                    <Typography variant="h6" component="div">
                        Scolar Sphère
                    </Typography>
                </Box>
                <Button variant="contained" color="secondary" onClick={handleLogout}>Déconnexion</Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;