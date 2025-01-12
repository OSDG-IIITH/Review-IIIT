import React from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        padding: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © 2024-2025 OSDG. All rights reserved.{' '}
        <Link component={RouterLink} to="/credits" color="inherit">
          Credits
        </Link>{' '}
        |{' '}
        <Link component={RouterLink} to="/#privacy-policy" color="inherit">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link component={RouterLink} to="/#tos" color="inherit">
          Terms of Service
        </Link>{' '}
        |{' '}
        <Link href="https://github.com/OSDG-IIITH/Review-IIIT/" color="inherit">
          Source Code
        </Link>{' '}
        |{' '}
        <Link href="https://osdg.iiit.ac.in" color="inherit">
          OSDG main page
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
