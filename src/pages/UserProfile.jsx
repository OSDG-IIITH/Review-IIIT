import React from 'react';
//import { useAuth } from '../context/AuthContext';
import { Container, Typography } from '@mui/material';

const UserProfile = () => {
//   const { currentUser } = useAuth();

//   if (!currentUser) return <div>Loading...</div>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1">
        {/* {currentUser.email} */}
        Example USER
      </Typography>
    </Container>
  );
};

export default UserProfile;
