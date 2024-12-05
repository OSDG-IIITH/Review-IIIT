import React from 'react';
import { CircularProgress, Box } from '@mui/material';

const FullPageLoader = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional: Semi-transparent background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensures the loader is on top of other content
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default FullPageLoader;
