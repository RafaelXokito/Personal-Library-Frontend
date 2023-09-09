import { React, useState } from 'react';
import { Button, TextField, Typography, Container, Switch, FormControlLabel } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle registration logic here...
        console.log(formData);
        console.log("Is Writer?", isWriter);
    };

    return (
        <div>
        <NavBar isLoggedIn={isLoggedIn} />
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
