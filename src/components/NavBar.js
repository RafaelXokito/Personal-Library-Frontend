import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

function NavBar() {
    const history = useNavigate();

    const userData = JSON.parse(localStorage.getItem("userData"));

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const handleLogout = () => {
        localStorage.clear(); // This will clear all the items in the localStorage
        window.location.reload();
    }

    const handleWriteABookPage = () => {
        history('/write-a-book');
    }

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
                    <Button color="inherit" onClick={() => history('/')}>
                        All Books
                    </Button>
                    {isLoggedIn ? (
                        <>
                            {userData?.role === "WRITER" ? 
                            <Button color="inherit" onClick={handleWriteABookPage}>
                                Write a Book
                            </Button> : null}
                            <Button color="inherit" onClick={() => history('/my-books')}>
                                {userData?.role === "WRITER" ? "My Artworks" : "My Reading Books"}
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
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