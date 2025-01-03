import React from 'react';
import { Typography, Grid, Box, Container } from '@mui/material';
import LoginButton from '../components/Login';

const Home: React.FC<{ isLoggedIn: boolean | null }> = ({ isLoggedIn }) => {
  return (
    <Container sx={{ mt: 6, mb: 6, color: 'text.primary' }}>
      <Typography variant="h3" gutterBottom align="center" color="primary">
        🎓 Welcome to ReviewIIITH 👋
      </Typography>
      <Typography variant="h5" gutterBottom align="center" sx={{ mb: 4 }}>
        A reviews portal by students, for students 🧑‍🎓
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        align="center"
        color="text.secondary"
      >
        Ever wished you had the inside scoop on a course before signing up for
        it? Confused on what research advisor to pick? 🤔 That&apos;s where this
        anonymous review portal comes in. Think of it as your go-to place for
        real, no-fluff opinions from fellow students about classes and
        instructors. Here&apos;s the deal: you can rate professors and courses
        on things like how clear their lectures are, how tough the workload is,
        or whether the grading feels fair. 📝
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary">
        The best part? 🌟 It&apos;s totally anonymous, so you can keep it real
        without worrying about any awkward run-ins. And it&apos;s super simple
        to use - just search by course or professor and see what others are
        saying. So, if you&apos;ve got thoughts, share them! And if you&apos;re
        curious about that one class everyone&apos;s whispering about, this is
        your spot to find out. 🚀
      </Typography>

      <Box sx={{ my: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6} id="privacy-policy">
            <Typography variant="h4" color="secondary" sx={{ mb: 4 }}>
              🔐 Privacy Policy
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              To ensure that this platform is only accessible to students of
              IIIT, the portal is guarded behind the CAS login. As a result of
              using the CAS API; your name, email and roll number will be
              visible to the backend code.
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              This information is used by the backend to generate a hash value
              that is associated with any reviews you make. By doing so, none of
              your details become directly associated with your reviews, so that
              your review stays anonymous even to the backend.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your privacy is our priority. We ensure all reviews remain
              anonymous and visible to students only, to the best of our
              ability.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} id="tos">
            <Typography
              variant="h4"
              gutterBottom
              color="secondary"
              sx={{ mb: 4 }}
            >
              📜 Terms of Use
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              By using this platform, you agree to share honest and constructive
              feedback. We trust the student community can use this site
              responsibly without abuse.
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              All content posted on the reviews reflect the opinions of their
              original authors, and not of OSDG members or admins. In no event
              shall the authors or contributors be held liable for any claim,
              damages, or other liability arising from the use or distribution
              of the software.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              By accessing and using this platform, you agree to these terms. If
              you do not agree, please refrain from using the platform.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Ready to get started? ✨
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join the conversation now! 🤝
        </Typography>
        <LoginButton isLoggedIn={isLoggedIn} />
      </Box>
    </Container>
  );
};

export default Home;
