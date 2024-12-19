import React from 'react';
import { Button, Box, Tooltip } from '@mui/material';
import { do_login } from '../api';

const LoginButton: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
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
      <Tooltip
        title={isLoggedIn ? 'You are logged in already' : 'Login with CAS'}
      >
        <span>
          <Button
            variant="contained"
            color="secondary"
            onClick={do_login}
            sx={{ marginTop: 2, minWidth: 150, size: 'large' }}
            disabled={isLoggedIn}
          >
            Login
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default LoginButton;
