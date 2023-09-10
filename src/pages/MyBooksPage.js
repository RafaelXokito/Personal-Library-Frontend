import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Button, Pagination } from '@mui/material';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    flexGrow: 1;
    padding: 24px;
    background: linear-gradient(120deg, #f6f9fc, #eef1f5);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
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

const StyledTitle = styled(Typography)`
    margin-bottom: 1rem;
    color: #0066FF; // Deep blue color for consistency
    border-bottom: 3px solid rgba(0, 128, 255, 0.3); // A subtle underline
    display: inline-block; // To make the border-bottom hug the content
    padding-bottom: 5px; // Some space between the text and the underline
`;

const Footer = styled('footer')`
    margin-top: auto;
    padding: 16px 0;
    text-align: center;
    position: sticky; 
    bottom: 0;
`;

function MyBooks() {
    const history = useNavigate();
    const [books, setBooks] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));

    const [page, setPage] = useState(1); // for current page number
    const itemsPerPage = 12; // or whatever number of items you want per page

    const handlePageChange = (event, value) => {
        setPage(value);
    };

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

    const handleAuthClickThisBook = (bookId) => async () => {
        if (userData.role === 'READER') {
            return history(`/read-book/${bookId}`)
        } else if (userData.role === 'WRITER') {
            return history(`/stats-book/${bookId}`)
        }
    };

    return (
        <Container>
            <NavBar isLoggedIn={!!userData} />
            <StyledTitle variant="h5" style={{ marginTop: '2rem', textAlign: 'center' }}>
                {userData?.role === "WRITER" ? "My Artworks" : "My Reading Books"}
            </StyledTitle>
            <Grid container spacing={3}>
                {books.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(book => (
                    <Grid key={book.id} item xs={12} sm={6} md={4}>
                        <StyledCard>
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
                                <Button variant="contained" color="secondary" onClick={handleAuthClickThisBook(book.id)}>
                                    {userData && userData.role === 'READER' ? "Read" : "Stats"}
                                </Button>
                            </CardContent>
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
        </Container>
    );
}

export default MyBooks;
