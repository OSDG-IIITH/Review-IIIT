import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Tooltip,
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

import UpvoteDownvote from './UpvoteDownvote';
import { api } from '../api';
import { FetchReviewsCallback, ReviewType } from '../types';

const Review: React.FC<{
  review: ReviewType;
  endpoint: string;
  onUpdate: FetchReviewsCallback;
}> = ({ review, endpoint, onUpdate }) => {
  const theme = useTheme(); // Access the theme

  const [openDialog, setOpenDialog] = useState<boolean>(false); // State for the dialog

  const formattedDate = new Date(review.dtime).toLocaleString();

  const handleDelete = async () => {
    try {
      await api.delete(endpoint);
      await onUpdate();
      setOpenDialog(false); // Close dialog after deletion
    } catch (error) {
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
          my: 2,
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
              <Tooltip title="Delete review">
                <IconButton
                  onClick={handleDialogOpen}
                  color="error"
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
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
          <Typography
            variant="body2"
            sx={{
              marginTop: 1,
              whiteSpace: 'pre-line',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}
          >
            {review.content.replace(/\n{3,}/g, '\n\n')}
          </Typography>
          <UpvoteDownvote
            review={review}
            endpoint={endpoint}
            onUpdate={onUpdate}
          />
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

export default Review;
