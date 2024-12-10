import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Box,
  Rating,
} from '@mui/material';

import theme from '../theme';
import ReviewInput from './ReviewInput';

import { api } from '../api';

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

const ReviewBox = ({ children, endpoint }) => {
  const [reviewsList, setReviewsList] = useState(null);
  const fetchReviews = async () => {
    setReviewsList(null);
    try {
      const response = await api.get(endpoint);
      setReviewsList(response.data);
    } catch (error) {
      // TODO: report error in frontend
      console.error('Error during search:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [endpoint]);

  return (
    <Card
      sx={{
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
        mb: 2,
      }}
    >
      <CardContent>
        {children}
        <Typography variant="h6" gutterBottom color="secondary" sx={{ mt: 1 }}>
          Reviews
        </Typography>
        {reviewsList === null ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "150px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (!reviewsList || reviewsList.length === 0) ? (
          <Typography variant="body1" color="text.secondary">
            No reviews available.
          </Typography>
        ) : (
          reviewsList.map((review, index) => (
            <Review
              key={index}
              datetime={review.dtime}
              rating={review.rating}
              message={review.content}
            />
          ))
        )}
        <ReviewInput endpoint={endpoint} onUpdate={fetchReviews} />
      </CardContent>
    </Card>
  );
};

export default ReviewBox;
