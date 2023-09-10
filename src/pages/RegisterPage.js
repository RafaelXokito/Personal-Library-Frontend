import { React, useState } from 'react';
import { Button, TextField, Typography, Container, Switch, FormControlLabel } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';
import axios from 'axios';
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

function RegisterPage() {
    const history = useNavigate();

    const [isLoggedIn] = useState(false);

    const classes = useStyles();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [isWriter, setIsWriter] = useState(false); // Switch state

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // 1. Make a POST request to register the user
            const registerResponse = await axios.post('http://localhost:8080/api/auth/register', {
                ...formData,
                isWriter: isWriter
            });
    
            // Check if the response contains an accessToken
            if (registerResponse.data && registerResponse.data.accessToken) {

                // Store the tokens and userId in local storage or state
                localStorage.setItem("accessToken", registerResponse.data.accessToken);
                localStorage.setItem("refreshToken", registerResponse.data.refreshToken);
                localStorage.setItem("userId", registerResponse.data.userId);
                localStorage.setItem("isLoggedIn", true);
                
                // 2. Update axios headers
                axios.defaults.headers.common['Authorization'] = `Bearer ${registerResponse.data.accessToken}`;
    
                // 3. Make a GET request to the /me endpoint
                const userResponse = await axios.get('http://localhost:8080/api/auth/me');
    
                if (userResponse.data) {
                    // 4. Store user data in local storage
                    localStorage.setItem('userData', JSON.stringify(userResponse.data));
                    localStorage.setItem('isLoggedIn', true);
                    history('/')
                }
            }
        } catch (error) {
            console.error('Error during registration or fetching user info:', error);
            // Handle the error as required, e.g., showing an error message to the user.
        }
    };    

    return (
        <div>
        <NavBar />
        <Container className={classes.container} maxWidth="xs">
            <Typography variant="h5" align="center">Register</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <TextField
                    name="firstName"
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={formData.firstName}
                    onChange={handleChange}
                />
                <TextField
                    name="lastName"
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={formData.lastName}
                    onChange={handleChange}
                />
                <TextField
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={isWriter}
                            onChange={() => setIsWriter(!isWriter)}
                            color="primary"
                        />
                    }
                    label="Register as Writer"
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </form>
        </Container>
        </div>
    );
}

export default RegisterPage;
