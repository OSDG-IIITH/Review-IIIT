import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import AddReview from './pages/AddReview';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FullPageLoader from './components/FullPageLoader';

import './App.css'; // Import the global styles
import theme from './theme';

import { api } from './api';

function App() {
  const basePath = window.location.pathname.split('/')[1] || ''; // Get first segment of the URL
  const baseUrl = `/${basePath}`;
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await api.get('/has_login');
        setIsLoggedIn(response.data);
      } catch (err) {
        // TODO: display error in some popup
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return <FullPageLoader />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={baseUrl}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh', // Make sure the entire page takes at least the full height
          }}
        >
          <Navbar isLoggedIn={isLoggedIn} />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
              <Route path="/courses" element={<CourseList />} />
              <Route path="/course/:id" element={<CourseDetails />} />
              <Route path="/add-review/:id" element={<AddReview />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
