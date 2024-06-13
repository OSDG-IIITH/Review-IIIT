import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { firestore } from '../firebase/config';
import { Container, TextField, Button, Typography } from '@mui/material';

// const AddReview = () => {
//   const { id } = useParams();
//   const [content, setContent] = useState('');
//   const history = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await firestore.collection('courses').doc(id).collection('reviews').add({ content });
//     history.push(`/course/${id}`);
//   };

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" component="h1" gutterBottom>
//         Add Review
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField
//           label="Review"
//           multiline
//           rows={4}
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </Container>
//   );
// };

// Mock function to simulate adding a review
const addReviewMock = async (id, content) => {
  console.log(`Adding review for course ${id} with content: ${content}`);
  // Simulate asynchronous behavior
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  // console.log('Review added successfully');
};

function AddReview() {
  const { id } = useParams();
  const [content, setContent] = useState('');
  const history = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // await firestore.collection('courses').doc(id).collection('reviews').add({ content });
    await addReviewMock(id, content); // Use the mock function instead of Firestore
    history.push(`/course/${id}`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Add Review
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Review"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="normal"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Container>
  );
}
export default AddReview;
