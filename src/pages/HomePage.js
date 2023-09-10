import React, { useState, useEffect } from 'react';

import { Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import styled from '@emotion/styled';

import axios from 'axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

const useStyles = styled((theme) => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    // ... add more styles as needed
}));

function HomePage() {

    const classes = useStyles();

    const history = useNavigate();

    // State to hold the books
    const [books, setBooks] = useState([]);

    const [myBooks, setMyBooks] = useState([]);

    const [searchParams, setSearchParams] = useState({
        title: '',
        keyword: '',
        writerName: ''
    });

    const [userData, setUserData] = useState([]);

    // Fetch books from the API when the component mounts
    useEffect(() => {

        console.log("User is logged in!");
        setUserData(JSON.parse(localStorage.getItem('userData')));

        fetch('http://localhost:8080/api/books')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching books:', error));
        
        if (localStorage.getItem("isLoggedIn") === "true") {
            const fetchUserBooks = async () => {
                try {
                    const response = await axios.get("http://localhost:8080/api/books/my", {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });
                    setMyBooks(response.data);
                } catch (error) {
                    console.error("Error fetching user books:", error.message);
                }
            };

            fetchUserBooks();
        }

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

    const handleAddThisBook = (book) => async () => {
        try {
            /*const response = */await axios.patch(`http://localhost:8080/api/books/${book.id}/add`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            setMyBooks(prevBooks => {
                return [
                  ...prevBooks,
                  book
                ]
              })
            
            // TODO - ALERT USER THAT BOOK IS ADDED TO MY BOOKS
        } catch (error) {
            console.error("Error fetching user books:", error.message);
        }
    };

    const handleAuthClickThisBook = (bookId) => async () => {
        if (userData.role === 'READER') {
            return history(`/read-book/${bookId}`)
        } else if (userData.role === 'WRITER') {
            return history(`/stats-book/${bookId}`)
        }
    };

    return (
        <div>
            <div className={classes.root}>
                <NavBar />
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
                                    <Typography variant="body2" color="textSecondary">
                                        {book.writerName}
                                    </Typography>
                                    { !myBooks.find(myBook => myBook.id === book.id) ? (
                                        userData && userData.role === 'READER' ?
                                        <Button variant="contained" color="primary" onClick={handleAddThisBook(book)}>
                                            Add
                                        </Button>
                                        : 
                                        localStorage.getItem("isLoggedIn") === "True" ?
                                        <p>Not Your Book</p>
                                        : null
                                    ) : (
                                        <Button variant="contained" color="secondary" onClick={handleAuthClickThisBook(book.id)}>
                                            {userData && userData.role === 'READER' ? "Read" : "Stats"}
                                        </Button>
                                    )}
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
