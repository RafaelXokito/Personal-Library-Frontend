import React, { useState, useEffect } from 'react';

import { Typography, Grid, Card, CardContent, TextField, Button, Pagination } from '@mui/material';
import styled from '@emotion/styled'

import axios from 'axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

const HomePageContainer = styled('div')`
    flexGrow: 1;
    padding: 24px;  // Replacing theme.spacing(3) with a static value
    background: linear-gradient(120deg, #f6f9fc, #eef1f5);
    min-height: 100vh;
`;

const SearchField = styled('div')`
    marginBottom: 16px;
`;

const SearchGrid = styled(Grid)`
    margin-top: 16px; 
    margin-bottom: 10px
`;

const StyledCard = styled(Card)`
    height: 100%;
    display: flex;
    flexDirection: column;
    borderRadius: 10px;
    overflow: hidden;
    boxShadow: 0px 0px 20px rgba(0,0,0,0.08);
    background-color: white; // Making the main card white
    position: relative;  
    padding: 4px;  // Adjusting the padding to show the gradient border more clearly

    &:before {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        z-index: -1;
        border-radius: 12px; // Slightly larger to make sure it's visible outside the main card
        background: linear-gradient(45deg, #b0c7d4, #5a7d9a);
    }

    transition: box-shadow 0.3s ease, transform 0.3s ease;
    &:hover {
        boxShadow: 0px 0px 25px rgba(0,0,0,0.1);
        transform: scale(1.03);
    }
`;

const StyledCardContent = styled(CardContent)`
    flexGrow: 1;
`;

const Footer = styled('footer')`
    marginTop: 32px;   // Replacing theme.spacing(4) with a static value
    marginBottom: 16px;   // Replacing theme.spacing(2) with a static value
    borderTop: 1px solid rgba(0,0,0,0.1);
    paddingTop: 16px;   // Replacing theme.spacing(2) with a static value
`;

const SearchButton = styled(Button)`
    margin-top: 8px;   // Replacing theme.spacing(1) with a static value
    background-color: #007BFF;
    &:hover {
        background-color: #0056b3;
    }
`;

function HomePage() {

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

    const [page, setPage] = useState(1); // for current page number
    const itemsPerPage = 12; // or whatever number of items you want per page

    const handlePageChange = (event, value) => {
        setPage(value);
    };

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
        <HomePageContainer>
            <SearchField>
                <NavBar />
                <SearchGrid container spacing={2} justify="center" alignItems="center">
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
                        <SearchButton variant="contained" color="primary" onClick={handleSearch}>
                            Search
                        </SearchButton>
                    </Grid>
                </SearchGrid>
            </SearchField>
            <Grid container spacing={3}>
                {/* Map through the books and render each one */}
                {books.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(book => (
                    <Grid key={book.id} item xs={12} sm={6} md={4}>
                        <StyledCard>
                            <StyledCardContent>
                                <Typography variant="h5" component="div">
                                    {book.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {book.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" textAlign={'right'}>
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
                            </StyledCardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination 
                    count={Math.ceil(books.length / itemsPerPage)} 
                    page={page} 
                    onChange={handlePageChange} 
                    variant="outlined" 
                    shape="rounded"
                />
            </div>
            <Footer style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                    © 2023 Personal Book Library
                </Typography>
            </Footer>
        </HomePageContainer>
    );
}

export default HomePage;
