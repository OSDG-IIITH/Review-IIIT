import React from 'react';
import {
  Typography,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const Credits: React.FC = () => {
  return (
    <Container sx={{ mt: 6, mb: 6, color: 'text.primary' }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Credits
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="secondary">
          Idea Contributors
        </Typography>
        <Typography color="text.secondary">
          This project was inspired by some projects submitted during HackIIIT
          2024. We would like to acknowledge the following teams whose projects
          have inspired this portal:
        </Typography>
        <List sx={{ pl: 4, color: 'text.secondary' }}>
          <ListItem>
            <ListItemText
              primary="Hacker hain bhai Hacker"
              secondary="(Jainil Bavishi, Parth Tokekar, Varun Gupta, and Vaibhav Wadhwani)"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Segmentation Fault"
              secondary="(Sahil, Rishiveer Yadav Angirekula, and Bassam Adnan)"
            />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom color="secondary">
          Code Contributors
        </Typography>
        <Typography color="text.secondary">
          The core implementation and development of this project were carried
          out by:
        </Typography>
        <List sx={{ pl: 4, color: 'text.secondary' }}>
          <ListItem>
            <ListItemText primary="Abhiram Tilak" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Agyeya Negi" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Ankith Pai" />
          </ListItem>
        </List>
        <Typography color="text.secondary">
          We look forward to adding more contributors to this list as the
          project evolves!
        </Typography>
      </Box>

      <Box>
        <Typography variant="h4" gutterBottom color="secondary">
          Users and Beta Testers
        </Typography>
        <Typography color="text.secondary">
          A big thank you to all our beta testers who provided invaluable
          feedback and bug reports. Your efforts have greatly improved the
          quality of this platform.
        </Typography>
        <Typography color="text.secondary">
          Finally, to all our users: your feedback is what makes this platform
          better for everyone. Thank you for sharing your thoughts and reviews!
        </Typography>
      </Box>
    </Container>
  );
};

export default Credits;
