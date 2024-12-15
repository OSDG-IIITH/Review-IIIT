import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Box,
  Rating,
  IconButton,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import theme from '../theme';
import ReviewInput from './ReviewInput';

import { api } from '../api';

const Review = ({ review, endpoint, onUpdate }) => {
  const theme = useTheme(); // Access the theme

  const [openDialog, setOpenDialog] = useState(false); // State for the dialog

  const formattedDate = new Date(review.dtime).toLocaleString();

  const handleDelete = async () => {
    try {
      await api.delete(endpoint);
      await onUpdate();
      setOpenDialog(false); // Close dialog after deletion
    } catch (error) {
      // TODO: convey message to frontend
      console.error('Error deleting the review:', error);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          margin: 2,
          backgroundColor: review.is_reviewer
            ? theme.palette.action.hover
            : theme.palette.background.paper,
          border: review.is_reviewer
            ? `1px solid ${theme.palette.secondary.main}`
            : `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent>
          {review.is_reviewer && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                Your review (this line is only visible to you)
              </Typography>
              <IconButton onClick={handleDialogOpen} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
          <Box display="flex" alignItems="center" sx={{ marginTop: 1 }}>
            <Rating value={review.rating} readOnly precision={1} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ marginLeft: 1 }}
            >
              {formattedDate}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            {review.content}
          </Typography>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this review?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const ReviewBox = ({ children, title, endpoint, initExpanded }) => {
  const [reviewsList, setReviewsList] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const cache = useRef({}); // Cache for reviews data

  const fetchReviews = async () => {
    setReviewsList(null);
    try {
      const response = await api.get(endpoint);
      cache.current[endpoint] = response.data;
      setReviewsList(response.data);
    } catch (error) {
      // TODO: report error in frontend
      console.error('Error during search:', error);
    }
  };

  const fetchReviewsAllowCache = () => {
    if (cache.current[endpoint]) {
      setReviewsList(cache.current[endpoint]);
    } else {
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
          <IconButton onClick={toggleExpand} size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
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
                  review={review}
                  endpoint={endpoint}
                  onUpdate={fetchReviews}
                />
              ))
            )}
            <ReviewInput endpoint={endpoint} onUpdate={fetchReviews} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewBox;
