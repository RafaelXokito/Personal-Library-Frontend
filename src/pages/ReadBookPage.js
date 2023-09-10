import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';

import styled from '@emotion/styled';

const StyledReadBookPage = styled.div`
    background: linear-gradient(120deg, #f6f9fc, #eef1f5);
    min-height: 100vh;
    padding: 2rem;

    h1 {
        color: #007BFF;
        margin-bottom: 1.5rem;
    }

    button {
        padding: 0.5rem 1rem;
        margin: 0 0.5rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
        &:hover {
            opacity: 0.9;
        }
    }

    .bookContent {
        background: #fff;
        padding: 1.5rem;
        box-shadow: 0px 0px 20px rgba(0,0,0,0.08);
        border-radius: 10px;
        margin-bottom: 2rem;

        p {
            font-size: 1.1rem;
            line-height: 1.6;
        }

        span {
            display: inline-block;
            margin: 1rem;
            color: #007BFF;
        }

        button {
            background-color: #007BFF;
            color: #fff;

            &:first-of-type {
                margin-right: 1rem;
            }

            &:last-of-type {
                margin-left: 1rem;
            }
        }
    }

    .writerInfo {
        background: #f6f9fc;
        padding: 1rem;
        border-radius: 10px;
        border-left: 4px solid #007BFF;
        margin-bottom: 2rem;

        p {
            margin-bottom: 0.5rem;
        }
    }

    .removeButton {
        background-color: #dc3545;
        color: #fff;

        &:hover {
            background-color: #c82333;
        }
    }
`;

function ReadBookPage() {
    const [content, setContent] = useState('');
    const [page, setPage] = useState(1);

    const { bookId } = useParams();
    const role = localStorage.getItem('role');

    const [writer, setWriter] = useState({});

    const history = useNavigate();

    const fetchWriterData = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            const response = await axios.get(`http://localhost:8080/api/books/${bookId}/writer`);
            setWriter(response.data);
        }
        catch (error) {
            console.error("Error fetching writer data:", error);
        }
    };

    const fetchContent = async () => {
        try {
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
            const response = await axios.patch(`http://localhost:8080/api/books/${bookId}/read`);
            setContent(response.data.content);
            setPage(response.data.page);
        } catch (error) {
            console.error("Error fetching content:", error);
            history(-1);
        }
    };

    const handleRemoveBook = async () => {
        let config = {
            method: 'delete',
            url: `http://localhost:8080/api/books/${bookId}/remove`
        };

        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        
        axios.request(config)
        .then(() => {
            history('/my-books');
        })
        .catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        fetchContent();
        fetchWriterData();
    }, [bookId, role]);

    const handlePageChange = async (direction) => {
        const endpoint = direction === 'next' ? 'nextpage' : 'previouspage';
        try {
            const response = await axios.patch(`http://localhost:8080/api/books/${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                },
            });
            setContent(response.data.content);
            setPage(response.data.page);
        } catch (error) {
            console.error("Error changing page:", error);
        }
    };

    return (
        <StyledReadBookPage>
            <NavBar/>
            <div className="bookContent" style={{marginTop: '16px'}}>
                <h1>Reading Book</h1>
                <p>{content}</p>
                <button onClick={() => handlePageChange('previous')}>Previous Page</button>
                <span>Page {page}</span>
                <button onClick={() => handlePageChange('next')}>Next Page</button>
            </div>
            <div className="writerInfo">
                <p>{writer.name}</p>
                <p>{writer.email}</p>
            </div>
            <div>
                <button className="removeButton" onClick={handleRemoveBook}>Remove Book</button>
            </div>
        </StyledReadBookPage>
    );
}

export default ReadBookPage;
