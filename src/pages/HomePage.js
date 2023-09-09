import React, { useState, useEffect } from 'react';

import { Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

const useStyles = styled((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    // ... add more styles as needed
}));

function HomePage() {

    const classes = useStyles();

    // State to hold the books
    const [books, setBooks] = useState([]);

    const [isLoggedIn] = useState(false);

    const [searchParams, setSearchParams] = useState({
        title: '',
        keyword: '',
        writerName: ''
    });

    // Fetch books from the API when the component mounts
    useEffect(() => {
        fetch('http://localhost:8080/api/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    }, []); // The empty dependency array ensures this useEffect runs once when the component mounts

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/books/search?title=${searchParams.title}&keyword=${searchParams.keyword}&writerName=${searchParams.writerName}`);
            const data = await response.json();
            
            setBooks(data);
            // Process and display the data as needed
            // console.log(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    return (
        <div>
            <div className={classes.root}>
                <NavBar isLoggedIn={isLoggedIn} />
                <Grid container spacing={2} justify="center" alignItems="center">
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={searchParams.title}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, title: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Keyword"
                            fullWidth
                            value={searchParams.keyword}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Writer Name"
                            fullWidth
                            value={searchParams.writerName}
                            onChange={(e) => setSearchParams(prev => ({ ...prev, writerName: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button variant="contained" color="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {/* Map through the books and render each one */}
                    {books.map(book => (
                        <Grid key={book.id} item xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {book.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <footer style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Typography variant="body2" color="textSecondary">
                        © 2023 Personal Book Library
                    </Typography>
                </footer>
            </div>
        </div>
    );
}

export default HomePage;
