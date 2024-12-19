import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { clear_errmsg } from '../api';

const ErrorDialog: React.FC<{ errorMessage: string | null }> = ({
  errorMessage,
}) => {
  return (
    <Dialog open={!!errorMessage} onClose={clear_errmsg}>
      <DialogTitle>Error Occurred</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
        <DialogContentText>
          Reloading the site might be helpful.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={clear_errmsg} color="secondary">
          Close
        </Button>
        <Button
          onClick={() => window.location.reload()}
          color="primary"
          autoFocus
        >
          Reload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorDialog;
