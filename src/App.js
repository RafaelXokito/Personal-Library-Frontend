import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyBooksPage from './pages/MyBooksPage';
import { AuthProvider } from './pages/AuthProvider';
import ReadBookPage from './pages/ReadBookPage';
import StatsBookPage from './pages/StatsBookPage';
import WriteABook from './pages/WriteABookPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/write-a-book" element={<WriteABook />} />
            <Route path="/my-books" element={<MyBooksPage />} />
            <Route path="/read-book/:bookId" element={<ReadBookPage />} />
            <Route path="/stats-book/:bookId" element={<StatsBookPage />} />
            {/* ... other routes ... */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
