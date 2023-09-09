import React, { useState } from 'react';
import { Button, TextField, Typography, Link, Container } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

const useStyles = styled((theme) => ({
    container: {
        padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
}));

function LoginPage() {
    const history = useNavigate();
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoggedIn] = useState(false);

    const isAuthenticated = !!localStorage.getItem("accessToken");

    if (isAuthenticated) {
        return <Redirect to="/" />; 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Define the request URL and body
        const url = "http://localhost:8080/api/auth/login";
        const requestBody = {
            email: email,
            password: password
        };
    
        try {
            // Make the HTTP POST request
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
    
            // Check if the response is successful
            if (response.ok) {
                const data = await response.json();
    
                // Store the tokens and userId in local storage or state
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("userId", data.userId);
    
                // Redirect to the home after successful login
                history('/')
    
                console.log("Login successful!");
            } else {
                // Handle errors (e.g., wrong credentials)
                const errorData = await response.json();
                console.error("Error logging in:", errorData.message);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    return (
        <div>
        <NavBar isLoggedIn={isLoggedIn} />
        <Container className={classes.container} maxWidth="xs">
            <Typography variant="h5" align="center">Login</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
            <Typography align="center">
                Don't have an account? <Link href="/register">Register</Link>
            </Typography>
        </Container>
        </div>
    );
}

export default LoginPage;
