import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Box } from "@mui/material";

import Home from './pages/Home';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';
import AddReview from './pages/AddReview';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import './App.css'; // Import the global styles
import theme from './theme';

function App() {
  const basePath = window.location.pathname.split('/')[1] || ''; // Get first segment of the URL
  const baseUrl = `/${basePath}`;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={baseUrl}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Make sure the entire page takes at least the full height
          }}
        >
          <Navbar />
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
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
