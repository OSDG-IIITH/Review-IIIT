import React from 'react';
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  Rating,
} from '@mui/material';

const Review = ({ datetime, rating, message }) => {
  const formattedDate = new Date(datetime).toLocaleString();
  return (
    <Card variant="outlined" sx={{ margin: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" sx={{ marginTop: 1 }}>
          <Rating value={rating} readOnly precision={1} />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ marginLeft: 1 }}
          >
            {formattedDate}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          {message}
        </Typography>
      </CardContent>
    </Card>
  );
};

const ReviewList = ({ reviews }) => {
  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom color="primary">
        Reviews
      </Typography>
      {!reviews || reviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No reviews available.
        </Typography>
      ) : (
        reviews.map((review, index) => (
          <Review
            datetime={review.dtime}
            rating={review.rating}
            message={review.content}
          />
        ))
      )}
    </Container>
  );
};

export default ReviewList;
