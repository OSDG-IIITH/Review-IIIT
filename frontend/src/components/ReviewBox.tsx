import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import theme from '../theme';
import Review from './Review';
import ReviewInput from './ReviewInput';

import { api } from '../api';
import { ReviewType } from '../types';

const ReviewBox: React.FC<{
  children?: React.ReactNode;
  title: string;
  endpoint: string;
  initExpanded: boolean;
}> = ({ children, title, endpoint, initExpanded }) => {
  const [reviewsList, setReviewsList] = useState<ReviewType[] | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const cache = useRef<Record<string, ReviewType[]>>({}); // Cache for reviews data

  const fetchReviews = async () => {
    try {
      const response = await api.get(endpoint);
      cache.current[endpoint] = response.data;
      setReviewsList(response.data);
    } catch (error) {
      console.error('Error during search:', error);
    }
  };

  const fetchReviewsAllowCache = () => {
    if (cache.current[endpoint]) {
      setReviewsList(cache.current[endpoint]);
    } else {
      setReviewsList(null); // show loading
      fetchReviews();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  /* init expanded when endpoint changes */
  useEffect(() => {
    if (initExpanded != isExpanded) {
      /* reviews will be updated in the isExpanded watcher */
      setIsExpanded(initExpanded);
    } else {
      /* isExpanded watcher will not be called, so force update here */
      if (initExpanded) {
        fetchReviewsAllowCache();
      } else {
        setReviewsList(null);
      }
    }
  }, [endpoint]);

  useEffect(() => {
    if (isExpanded) {
      fetchReviewsAllowCache();
    } else {
      setReviewsList(null);
    }
  }, [isExpanded]);

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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" color="primary">
            {title}
          </Typography>
          <Tooltip
            title={
              isExpanded
                ? 'Click to collapse section'
                : 'Click to expand section'
            }
          >
            <IconButton onClick={toggleExpand} size="small">
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        {isExpanded && (
          <>
            {children}
            <Typography
              variant="h6"
              gutterBottom
              color="secondary"
              sx={{ mt: 1 }}
            >
              Reviews
            </Typography>
            {reviewsList === null ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '150px',
                }}
              >
                <CircularProgress />
              </Box>
            ) : !reviewsList || reviewsList.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No reviews available.
              </Typography>
            ) : (
              reviewsList.map((review, index) => (
                <Review
                  key={index}
                  review={review}
                  endpoint={endpoint}
                  onUpdate={fetchReviews}
                />
              ))
            )}
            {reviewsList !== null && (
              <ReviewInput
                endpoint={endpoint}
                onUpdate={fetchReviews}
                hasReview={reviewsList.some((review) => review.is_reviewer)}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewBox;
