import { Button, Box, Tooltip } from '@mui/material';
import { do_login, do_logout } from '../api';

const LoginButton = ({ isLoggedIn }) => {
  // UI rendering
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Tooltip title={isLoggedIn ? "Logout with CAS" : "Login with CAS"}>
        <Button
          variant="contained"
          color="secondary"
          onClick={isLoggedIn ? do_logout : do_login}
          sx={{ marginTop: 2, minWidth: 150, size: 'large' }}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </Tooltip >
    </Box>
  );
};

export default LoginButton;
