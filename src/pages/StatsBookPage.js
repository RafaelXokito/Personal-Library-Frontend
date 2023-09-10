import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import NavBar from '../components/NavBar';

const PageContainer = styled('div')`
  padding: 24px;
  background: linear-gradient(120deg, #f6f9fc, #eef1f5);
  min-height: 100vh;
`;

const HeadingPrimary = styled('h1')`
  color: #007BFF;
  margin-bottom: 1.5rem;
`;

const Section = styled('section')`
  background: #fff;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0,0,0,0.08);
`;

const HeadingSecondary = styled('h2')`
  color: #007BFF;
  margin-bottom: 1rem;
  border-bottom: 2px solid #007BFF;
  display: inline-block;
`;

const List = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled('li')`
  padding: 0.5rem 0;
  color: #555;
  font-size: 1rem;
`;

const StatsInfo = styled('p')`
  color: #FE6B8B;
  font-weight: bold;
`;

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
    <PageContainer>
      <NavBar />
      <HeadingPrimary>Stats for Book ID: {bookId}</HeadingPrimary>

      <Section>
        <HeadingSecondary>Current Readers</HeadingSecondary>
        <List>
          {currentReaders.map((reader, index) => (
            <ListItem key={index}>
              {reader.name} ({reader.email})
            </ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <HeadingSecondary>All Readers</HeadingSecondary>
        <List>
          {readers.map((reader, index) => (
            <ListItem key={index}>
              {reader.name} ({reader.email})
            </ListItem>
          ))}
        </List>
      </Section>

      <Section>
        <HeadingSecondary>Stats Overview</HeadingSecondary>
        <StatsInfo>Total Number of Readers: {readers.length}</StatsInfo>
        <StatsInfo>Currently Reading: {currentReaders.length}</StatsInfo>
      </Section>
    </PageContainer>
  );
}

export default StatsBookPage;
