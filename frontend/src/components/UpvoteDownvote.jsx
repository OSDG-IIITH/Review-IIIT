import React from 'react';
import { IconButton, Tooltip, Typography, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import { api } from '../api';

const UpvoteDownvote = ({ review, endpoint, onUpdate }) => {
  const sendVoteToAPI = async (vote) => {
    try {
      await api.post(`${endpoint}/votes`, {
        vote: vote,
        review_id: review.review_id,
      });
      await onUpdate();
    } catch (error) {
      console.error('Failed to send vote', error);
    }
  };

  const isSelected = (newStatus) => {
    return review.votes_status === newStatus;
  };

  const handleVote = async (newStatus) => {
    if (isSelected(newStatus)) {
      await sendVoteToAPI(0);
    } else {
      await sendVoteToAPI(newStatus);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      width="fit-content"
      gap={1}
      border={1}
      borderRadius={2}
      borderColor="text.secondary"
      mt={2}
    >
      <Tooltip title={isSelected(1) ? 'Click to remove upvote' : 'Click to upvote review'}>
        <IconButton
          onClick={() => handleVote(1)}
          color={isSelected(1) ? 'success' : 'default'}
          size="small"
        >
          <ThumbUpIcon />
        </IconButton>
      </Tooltip>
      <Typography variant="body1" size="small">
        {review.votes_aggregate}
      </Typography>
      <Tooltip title={isSelected(-1) ? 'Click to remove downvote' : 'Click to downvote review'}>
        <IconButton
          onClick={() => handleVote(-1)}
          color={review.votes_status === -1 ? 'error' : 'default'}
          size="small"
        >
          <ThumbDownIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default UpvoteDownvote;
