import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import Home from './pages/Home';
import CourseList from './pages/CourseList';
import Profs from './pages/Profs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FullPageLoader from './components/FullPageLoader';

import './App.css'; // Import the global styles
import theme from './theme';

import { api } from './api';

import { HOST_SUBPATH } from './constants';

function App() {
  // Check if the current path is outside the subpath
  if (!window.location.pathname.startsWith(HOST_SUBPATH)) {
    const normalizedPath = `${HOST_SUBPATH}${window.location.pathname}`;
    window.location.replace(normalizedPath.replace(/\/{2,}/g, '/')); // Ensure no double slashes
    return null; // Render nothing until the redirection happens
  }

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
      <Router basename={HOST_SUBPATH}>
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
              {isLoggedIn && (
                <>
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/profs" element={<Profs />} />
                </>
              )}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
