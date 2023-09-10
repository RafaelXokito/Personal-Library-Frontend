import { React, useState } from 'react';
import { Button, TextField, Typography, Container, Switch, FormControlLabel } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContainerStyled = styled('div')`
    flexGrow: 1;
    padding: 24px;  // Replacing theme.spacing(3) with a static value
    background: linear-gradient(120deg, #f6f9fc, #eef1f5);
    min-height: 100vh;
`;

const StyledContainer = styled(Container)`
    padding: 2rem;
    background: linear-gradient(120deg, #f6f9fc, #eef1f5);
    border-radius: 10px;
    box-shadow: 0px 0px 20px rgba(0,0,0,0.08);
    margin-top: 3rem;
`;

const StyledTypography = styled(Typography)({
    color: '#007BFF',
    marginBottom: '2rem',
});

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
});

const FormControlStyled = styled(FormControlLabel)`
&& {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
`;

function RegisterPage() {
    const history = useNavigate();
    
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
        <ContainerStyled>
            <NavBar />
            <StyledContainer maxWidth="xs">
                <StyledTypography variant="h5" align="center">Register</StyledTypography>
                <StyledForm onSubmit={handleSubmit}>
                    <TextField name="firstName" label="First Name" variant="outlined" fullWidth value={formData.firstName} onChange={handleChange} />
                    <TextField name="lastName" label="Last Name" variant="outlined" fullWidth value={formData.lastName} onChange={handleChange} />
                    <TextField name="email" label="Email" variant="outlined" fullWidth value={formData.email} onChange={handleChange} />
                    <TextField name="password" label="Password" variant="outlined" fullWidth type="password" value={formData.password} onChange={handleChange} />
                    <FormControlStyled
                        control={
                            <Switch
                                checked={isWriter}
                                onChange={() => setIsWriter(!isWriter)}
                                color="primary"
                            />
                        }
                        label="Register as Writer"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
                        Register
                    </Button>
                </StyledForm>
            </StyledContainer>
        </ContainerStyled>
    );
}

export default RegisterPage;
