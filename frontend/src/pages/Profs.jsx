import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Container,
  Typography,
  Tooltip,
} from '@mui/material';

import FullPageLoader from '../components/FullPageLoader';

import ReviewBox from '../components/ReviewBox';

const Profs = ({ profList }) => {
  const [selectedProf, setSelectedProf] = useState(null);
  const [reviewProf, setReviewProf] = useState(null);

  if (profList === null) {
    return <FullPageLoader />;
  }

  return (
    <Container sx={{ mt: 3, mb: 3, color: 'text.primary' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        sx={{ width: '100%', mb: 2 }}
      >
        <Autocomplete
          options={profList}
          autoComplete={true}
          autoHighlight={true}
          getOptionLabel={(option) => `${option.name} <${option.email}>`}
          onChange={(event, newValue) => setSelectedProf(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Search (by name or email)" />
          )}
          sx={{ borderRadius: 2, flexGrow: 1 }}
          size="small"
        />
        <Tooltip
          title={
            selectedProf === null || selectedProf == reviewProf
              ? 'Select a new professor first'
              : 'Display reviews'
          }
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setReviewProf(selectedProf)}
              disabled={selectedProf === null || selectedProf == reviewProf}
              size="small"
            >
              Search
            </Button>
          </span>
        </Tooltip>
      </Box>
      {reviewProf ? (
        <ReviewBox endpoint={`/members/reviews/${reviewProf.email}`}>
          <Typography variant="h5" gutterBottom color="primary">
            {reviewProf.name} &lt;{reviewProf.email}&gt;
          </Typography>
        </ReviewBox>
      ) : (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontStyle: 'italic' }}
        >
          Please pick a professor from the dropdown and then hit search.
        </Typography>
      )}
    </Container>
  );
};

export default Profs;
