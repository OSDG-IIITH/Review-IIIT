import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import Home from './pages/Home';
import Courses from './pages/Courses';
import Credits from './pages/Credits';
import Profs from './pages/Profs';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FullPageLoader from './components/FullPageLoader';
import ErrorDialog from './components/ErrorDialog';

import './App.css'; // Import the global styles
import theme from './theme';

import { api, set_logout_callback, set_errmsg_callback } from './api';

import { HOST_SUBPATH } from './constants';

function App() {
  // Check if the current path is outside the subpath
  if (!window.location.pathname.startsWith(HOST_SUBPATH)) {
    const normalizedPath = `${HOST_SUBPATH}${window.location.pathname}`;
    window.location.replace(normalizedPath.replace(/\/{2,}/g, '/')); // Ensure no double slashes
    return null; // Render nothing until the redirection happens
  }

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [courseList, setCourseList] = useState(null);
  const [profList, setProfList] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const logoutHandler = () => {
    setIsLoggedIn(false);
    setProfList(null);
    setCourseList(null);
  };

  useEffect(() => {
    set_logout_callback(logoutHandler);
    set_errmsg_callback(setErrMsg);
    const checkLoginAndFetchLists = async () => {
      try {
        const response_login = await api.get('/has_login');
        setIsLoggedIn(response_login.data);
        if (response_login.data) {
          const response_members = await api.get('/members/');
          // sort by ascending order of name
          setProfList(
            response_members.data.sort((a, b) => a.name.localeCompare(b.name))
          );

          const response_courses = await api.get('/courses/');
          response_courses.data.sort((a, b) => {
            // Extract year and term (S/M) for comparison
            const [termA, yearA] = [a.sem[0], parseInt(a.sem.slice(1))];
            const [termB, yearB] = [b.sem[0], parseInt(b.sem.slice(1))];

            // Compare by year first (descending order)
            if (yearA !== yearB) {
              return yearB - yearA;
            }

            // If the year is the same, compare by term (M before S)
            if (termA !== termB) {
              return termA === 'M' ? -1 : 1;
            }

            // If the semester is the same, compare by name (ascending order)
            return a.name.localeCompare(b.name);
          });
          setCourseList(response_courses.data);
        } else {
          logoutHandler();
        }
      } catch (error) {
        console.error('Error fetching login status and details:', error);
      }
    };

    checkLoginAndFetchLists();
  }, []);

  if (isLoggedIn === null) {
    return <><FullPageLoader /><ErrorDialog errorMessage={errMsg} /></>;
  }

  // make a Map out of profList data for efficient name lookup from email
  const profMap =
    profList === null
      ? null
      : new Map(profList.map((prof) => [prof.email, prof]));

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
              <Route path="/credits" element={<Credits />} />
              {isLoggedIn && (
                // Ensure these frontend pages can only render on login status
                <>
                  <Route
                    path="/courses"
                    element={
                      <Courses courseList={courseList} profMap={profMap} />
                    }
                  />
                  <Route
                    path="/profs"
                    element={<Profs profList={profList} />}
                  />
                </>
              )}
              {/* this is a catch all (kind of 404 handler) redirect to root */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
          <Footer />
          <ErrorDialog errorMessage={errMsg} />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
