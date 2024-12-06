import React from 'react';
import { Box, Typography, Link } from '@mui/material';

import { HOST_SUBPATH } from '../constants';

const Footer = () => {
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
        © 2024 OSDG. All rights reserved.{' '}
        <Link href={`${HOST_SUBPATH}#privacy-policy`} color="inherit">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link href={`${HOST_SUBPATH}#tos`} color="inherit">
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
