import React, { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import styled from '@emotion/styled';
import axios from 'axios';
import NavBar from '../components/NavBar';
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

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledButton = styled(Button)`
    background-color: #007BFF;
    &:hover {
        background-color: #0056b3;
    }
`;

const Footer = styled('footer')`
    marginTop: 32px;   // Replacing theme.spacing(4) with a static value
    marginBottom: 16px;   // Replacing theme.spacing(2) with a static value
    borderTop: 1px solid rgba(0,0,0,0.1);
    paddingTop: 16px;   // Replacing theme.spacing(2) with a static value
`;

function WriteABook() {
    const history = useNavigate();

    const [bookData, setBookData] = useState({
        title: '',
        description: '',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8080/api/books', bookData);

            if (response.data) {
                console.log('Book successfully created!', response.data);
                setBookData({
                    title: '',
                    description: '',
                    content: ''
                });
                history('/my-books');
            }
        } catch (error) {
            console.error('Error creating the book:', error);
        }
    };

    return (
        <ContainerStyled>
            <NavBar />
            <StyledContainer maxWidth="md">
                <Typography variant="h5" align="center">Write a New Book</Typography>
                <Form onSubmit={handleSubmit}>
                    <TextField
                        name="title"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={bookData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        name="description"
                        label="Description"
                        variant="outlined"
                        fullWidth
                        value={bookData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        name="content"
                        label="Content"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={bookData.content}
                        onChange={handleChange}
                    />
                    <StyledButton type="submit" variant="contained" fullWidth>
                        Submit
                    </StyledButton>
                </Form>
            </StyledContainer>
            <Footer style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    © 2023 Personal Book Library
                </Typography>
            </Footer>
        </ContainerStyled>
    );
}

export default WriteABook;
