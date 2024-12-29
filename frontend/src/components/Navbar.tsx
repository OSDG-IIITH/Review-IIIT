import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link, useLocation } from 'react-router';
import { do_login, do_logout } from '../api';

const Navbar: React.FC<{ isLoggedIn: boolean | null }> = ({ isLoggedIn }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Adjust for small screens
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          justifyContent: isSmallScreen ? 'center' : 'space-between',
          alignItems: 'center',
          textAlign: isSmallScreen ? 'center' : 'left',
          py: isSmallScreen ? 1 : 0,
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          📝 ReviewIIITH
        </Typography>
        {isLoggedIn ? (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button
              color="inherit"
              component={Link}
              to="/"
              size="large"
              sx={{
                ...(isActive('/') && {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }),
              }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/courses"
              size="large"
              sx={{
                ...(isActive('/courses') && {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }),
              }}
            >
              Courses
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/profs"
              size="large"
              sx={{
                ...(isActive('/profs') && {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }),
              }}
            >
              Professors
            </Button>
            <Button color="inherit" onClick={do_logout} size="large">
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            color="inherit"
            onClick={do_login}
            size="large"
            disabled={isLoggedIn === null}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
