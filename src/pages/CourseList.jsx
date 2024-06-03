import React, { useEffect, useState } from 'react';
// import { firestore } from '../firebase/config';
import coursesData from '../courses.json'; // Import the local course data
import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Grid } from '@mui/material';

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await firestore.collection('courses').get();
//       setCourses(data.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     };
//     fetchData();
//   }, []);

//   return (
//     <Container maxWidth="lg">
//       <Typography variant="h4" component="h1" gutterBottom>
//         Courses
//       </Typography>
//       <Grid container spacing={4}>
//         {courses.map(course => (
//           <Grid item key={course.id} xs={12} sm={6} md={4}>
//             <Link to={`/course/${course.id}`} style={{ textDecoration: 'none' }}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6">{course.name}</Typography>
//                 </CardContent>
//               </Card>
//             </Link>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };
const CourseList = () => {
    // Use coursesData from the imported JSON file instead of Firestore
    const courses = coursesData;
  
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Courses
        </Typography>
        <Grid container spacing={4}>
          {courses.map(course => (
            <Grid item key={course.id} xs={12} sm={6} md={4}>
              <Link to={`/course/${course.id}`} style={{ textDecoration: 'none' }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{course.name}</Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };
  
export default CourseList;
