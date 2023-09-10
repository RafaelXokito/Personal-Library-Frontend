import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';

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
        <div>
            <NavBar />
        <div>
            <h1>Reading Book</h1>
            {role === 'WRITER' && <button>Edit Book</button>}
            <p>{content}</p>
            <button onClick={() => handlePageChange('previous')}>Previous Page</button>
            <span>Page {page}</span>
            <button onClick={() => handlePageChange('next')}>Next Page</button>
        </div>
        <div>
            <p>{writer.name}</p>
            <p>{writer.email}</p>
        </div>
        <div>
            <button onClick={handleRemoveBook}>Remove Book</button>
        </div>
        </div>
    );
}

export default ReadBookPage;
