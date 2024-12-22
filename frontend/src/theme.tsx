import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing: 6,
  palette: {
    mode: 'dark',
    primary: {
      main: '#42a5f5', // A vibrant blue for primary actions
    },
    secondary: {
      main: '#66d9ef', // A soft blue-green for accents
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Slightly lighter for cards or surfaces
    },
    text: {
      primary: '#ffffff', // Bright white for primary text
      secondary: '#b0b0b0', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h3: {
      fontSize: '3rem',
    },
    h4: {
      fontSize: '2rem',
    },
    h5: {
      fontSize: '1.4rem',
    },
    h6: {
      fontSize: '1.2rem',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none', // Keeps button text from being all caps
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Rounded buttons
          padding: '8px 16px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#1f1f1f', // Dark app bar color
        },
      },
    },
  },
});

export default theme;
