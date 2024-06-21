import { Container, Typography } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Rate My Course
      </Typography>
      <Typography variant="body1">
        Find and rate your courses at our university.
      </Typography>
    </Container>
  );
}

export default Home;
