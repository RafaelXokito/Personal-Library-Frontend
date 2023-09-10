import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';

function StatsBookPage() {
  const [currentReaders, setCurrentReaders] = useState([]);
  const [readers, setReaders] = useState([]);
  const { bookId } = useParams();

  useEffect(() => {
    // Fetch the current readers of the book
    axios.get(`http://localhost:8080/api/books/${bookId}/currentreaders`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    })
    .then(response => setCurrentReaders(response.data))
    .catch(error => console.error('Error fetching current readers:', error));

    // Fetch the readers of the book
    axios.get(`http://localhost:8080/api/books/${bookId}/readers`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` }
    })
    .then(response => setReaders(response.data))
    .catch(error => console.error('Error fetching readers:', error));
  }, [bookId]);

  return (
    <div>
        <NavBar />
      <h1>Stats for Book ID: {bookId}</h1>

      <section>
        <h2>Current Readers</h2>
        <ul>
          {currentReaders.map((reader, index) => (
            <li key={index}>
              {reader.name} ({reader.email})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>All Readers</h2>
        <ul>
          {readers.map((reader, index) => (
            <li key={index}>
              {reader.name} ({reader.email})
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Stats Overview</h2>
        <p>Total Number of Readers: {readers.length}</p>
        <p>Currently Reading: {currentReaders.length}</p>
      </section>
    </div>
  );
}

export default StatsBookPage;
