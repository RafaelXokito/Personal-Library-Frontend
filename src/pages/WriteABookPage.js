import React, { useState } from 'react';
import { Button, TextField, Typography, Container } from '@mui/material';
import styled from '@emotion/styled';
import axios from 'axios';
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

function WriteABook() {
    const classes = useStyles();

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
                // Handle success, e.g., clear the form, show a success message, or navigate to another page.
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
            // Handle the error, e.g., showing an error message to the user.
        }
    };

    return (
        <>
        <NavBar />
        <Container className={classes.container} maxWidth="md">
            <Typography variant="h5" align="center">Write a New Book</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </form>
        </Container>
        </>
    );
}

export default WriteABook;
