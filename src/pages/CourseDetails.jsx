import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
//import { firestore } from '../firebase/config';
import coursesData from '../courses.json'; // Import the local course data
import { Container, Card, CardContent, Typography, Button, Grid } from '@mui/material';

// const CourseDetails = () => {
//   const { id } = useParams();
//   const [course, setCourse] = useState(null);
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const courseDoc = await firestore.collection('courses').doc(id).get();
//       setCourse({ id: courseDoc.id, ...courseDoc.data() });

//       const reviewsCollection = await firestore.collection('courses').doc(id).collection('reviews').get();
//       setReviews(reviewsCollection.docs.map(doc => doc.data()));
//     };
//     fetchData();
//   }, [id]);

//   if (!course) return <div>Loading...</div>;

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" component="h1" gutterBottom>
//         {course.name}
//       </Typography>
//       <Button variant="contained" color="primary" component={Link} to={`/add-review/${course.id}`}>
//         Add Review
//       </Button>
//       <Typography variant="h5" component="h2" gutterBottom>
//         Reviews
//       </Typography>
//       <Grid container spacing={4}>
//         {reviews.map((review, index) => (
//           <Grid item key={index} xs={12}>
//             <Card>
//               <CardContent>
//                 <Typography>{review.content}</Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [reviews, setReviews] = useState([]);
  
    useEffect(() => {
      const fetchCourse = () => {
        const selectedCourse = coursesData.find(course => course.id === id);
        setCourse(selectedCourse);
      };
  
      const fetchReviews = () => {
        // Simulate fetching reviews from a local storage or API
        // For simplicity, we'll use an empty array as we are not simulating reviews in this example
        setReviews([]);
      };
  
      fetchCourse();
      fetchReviews();
    }, [id]);
  
    if (!course) return <div>Loading...</div>;
  
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          {course.name}
        </Typography>
        <Button variant="contained" color="primary" component={Link} to={`/add-review/${course.id}`}>
          Add Review
        </Button>
        <Typography variant="h5" component="h2" gutterBottom>
          Reviews
        </Typography>
        <Grid container spacing={4}>
          {reviews.map((review, index) => (
            <Grid item key={index} xs={12}>
              <Card>
                <CardContent>
                  <Typography>{review.content}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };
export default CourseDetails;
