// MyBooks.js
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Button } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const useStyles = styled((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    // ... add more styles as needed
}));

function MyBooks() {
    const classes = useStyles();
    const [books, setBooks] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
        if (userData) {
            const fetchUserBooks = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/api/books/my", {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });
                    setBooks(response.data);
                } catch (error) {
                    console.error("Error fetching user books:", error.message);
                }
            };

            fetchUserBooks();
        }
    }, [userData]);

    return (
        <div className={classes.root}>
            <NavBar isLoggedIn={!!userData} />
            <Typography variant="h5" style={{ marginBottom: '1rem' }}>
                {userData?.role === "WRITER" ? "My Artworks" : "My Reading Books"}
            </Typography>
            <Grid container spacing={3}>
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
                                <Typography variant="body2" color="textSecondary">
                                    {book.writerName}
                                </Typography>
                                {userData?.role === "WRITER" ? 
                                <Link to={`/stats-book/${book.id}`}>Stats</Link> : 
                                <Link to={`/read-book/${book.id}`}>Read</Link>}
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
    );
}

export default MyBooks;
