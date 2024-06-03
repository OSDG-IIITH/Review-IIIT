import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import AddReview from './pages/AddReview';
import UserProfile from './pages/UserProfile';
import Navbar from './components/Navbar';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#1565c0',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/add-review/:id" element={<AddReview />} />
        <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
