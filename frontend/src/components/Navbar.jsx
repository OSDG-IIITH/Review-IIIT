import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { do_login, do_logout } from '../api';

const Navbar = ({ isLoggedIn }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Adjust for small screens

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{
        display: "flex",
        flexDirection: isSmallScreen ? "column" : "row",
        justifyContent: isSmallScreen ? "center" : "space-between",
        alignItems: "center",
        textAlign: isSmallScreen ? "center" : "left",
      }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReviewIIITH
        </Typography>
        {isLoggedIn ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/courses">
              Courses
            </Button>
            <Button color="inherit" component={Link} to="/profs">
              Professors
            </Button>
            <Button color="inherit" onClick={do_logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <>
            <Button color="inherit" onClick={do_login}>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
