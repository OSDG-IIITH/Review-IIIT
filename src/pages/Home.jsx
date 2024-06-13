import React from 'react';
import { Container, Typography } from '@mui/material';

const Home = () => (
  <Container maxWidth="lg">
    <Typography variant="h3" component="h1" gutterBottom>
      Welcome to Rate My Course
    </Typography>
    <Typography variant="body1">
      Find and rate your courses at our university.
    </Typography>
  </Container>
);

export default Home;
