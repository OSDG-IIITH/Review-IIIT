import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Rating,
  Typography,
  Tooltip,
} from '@mui/material';
import { api } from '../api';
import { MSG_MAX_LEN } from '../constants';
import { FetchReviewsCallback } from '../types';

const ReviewInput: React.FC<{
  endpoint: string;
  onUpdate: FetchReviewsCallback;
  hasReview: boolean;
}> = ({ endpoint, onUpdate, hasReview }) => {
  const [rating, setRating] = useState<number>(0); // State to hold rating value
  const [message, setMessage] = useState<string>(''); // State to hold message
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // State to manage form submission state

  const handleRatingChange = (
    event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setRating(newValue ?? 0); // Update rating when user interacts with the Rating component
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value); // Update message text as user types
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    if (!rating || message.trim() === '') {
      return;
    }

    setIsSubmitting(true); // Indicate that the submission is in progress

    try {
      await api.post(endpoint, {
        rating: rating,
        content: message,
      });
      setRating(0);
      setMessage('');
      await onUpdate();
    } catch (error) {
      console.error('Failed to sumbit review', error);
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom color="secondary" sx={{ mt: 1 }}>
        Submit a Review
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 2 }}>
        <Rating
          value={rating}
          onChange={handleRatingChange}
          precision={1}
          name="rating"
          size="large"
          sx={{ marginBottom: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          {message.length} / {MSG_MAX_LEN} characters
        </Typography>
        <TextField
          label="Your Review"
          value={message}
          onChange={handleMessageChange}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          sx={{ marginTop: 1, marginBottom: 2 }}
          slotProps={{
            htmlInput: { maxLength: MSG_MAX_LEN }, // Character limit set here
          }}
        />
        <Tooltip
          title={
            !rating || message.trim() === ''
              ? 'Add rating and/or content to be able to submit'
              : 'Submit review'
          }
        >
          <span>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || !rating || message.trim() === ''}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </span>
        </Tooltip>
      </Box>
      {hasReview && (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontStyle: 'italic' }}
        >
          To discourage spam, only one review per user per course/professor is
          allowed. As you have already posted a review here, it will be
          overwritten if you resubmit a new review.
        </Typography>
      )}
    </>
  );
};

export default ReviewInput;
