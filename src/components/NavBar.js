import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

function NavBar({ isLoggedIn }) {
    const history = useNavigate();

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }} onClick={() => history('/')}>
                        Personal Book Library
                    </Typography>
                    {!isLoggedIn && (
                        <Button color="inherit" onClick={() => history('/login')}>
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default NavBar;