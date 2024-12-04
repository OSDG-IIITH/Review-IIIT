import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ReviewIIITH
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/courses">
          Courses
        </Button>
        <Button color="inherit" component={Link} to="/profs">
          Professors
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
