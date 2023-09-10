
import axios from "axios";
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

    const handleSubmit = async (e) => {
        console.log("Login form submitted!")
        e.preventDefault();

        // Define the request URL and body
        const url = "http://localhost:8080/api/auth/login";
        const requestBody = {
            email: email,
            password: password
        };

        try {
            // Make the HTTP POST request
            const response = await axios.post(url, requestBody);

            // Store the tokens and userId in local storage or state
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("isLoggedIn", true);

            // Set up axios defaults
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
            
            try {
                // Make the GET request to the /me endpoint
                const response = await axios.get("http://localhost:8080/api/auth/me");
        
                if (response.data) {
                    // Store the user data or process as required
                    localStorage.setItem("userData", JSON.stringify(response.data));
                    localStorage.setItem("isLoggedIn", true);
                }
            } catch (error) {
                return false;
            }

            // Redirect to the home after successful login
            history('/')
            console.log("Login successful!");
        } catch (error) {
            if (error.response && error.response.data) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error logging in:", error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
            } else {
                // Something happened in setting up the request that triggered an error
                console.error("Error setting up request:", error.message);
            }
        }
    };


    return (
        <div>
        <NavBar />
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
