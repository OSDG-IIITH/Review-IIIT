import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { do_login, do_logout } from '../api';

const Navbar = ({ isLoggedIn }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReviewIIITH
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isLoggedIn ? (
          <>
            <Button color="inherit" component={Link} to="/courses">
              Courses
            </Button>
            <Button color="inherit" component={Link} to="/profs">
              Professors
            </Button>
            <Button color="inherit" onClick={do_logout}>
              Logout
            </Button>
          </>
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
