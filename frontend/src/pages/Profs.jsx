import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  Button,
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tooltip,
} from '@mui/material';

import FullPageLoader from '../components/FullPageLoader';
import ReviewInput from '../components/ReviewInput';
import ReviewList from '../components/ReviewList';

import { api } from '../api';
import theme from '../theme';

const Profs = () => {
  const [profList, setProfList] = useState(null);
  const [selectedProf, setSelectedProf] = useState(null);
  const [reviewProf, setReviewProf] = useState(null);
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await api.get('/members/');
        setProfList(response.data.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        // TODO: report error in frontend
        console.error('Error fetching data:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSearch = async () => {
    let chosenProf = selectedProf || reviewProf;
    if (!chosenProf || !chosenProf.email) {
      return;
    }

    setReviewsList(null); // loading
    try {
      const response = await api.get(`/members/reviews/${chosenProf.email}`);
      setReviewsList(response.data);
    } catch (error) {
      // TODO: report error in frontend
      console.error('Error during search:', error);
      setReviewsList([]);
    }
    if (selectedProf) {
      setReviewProf(selectedProf);
      setSelectedProf(null);
    }
  };

  if (profList === null || reviewsList === null) {
    return <FullPageLoader />;
  }

  return (
    <Container sx={{ mt: 6, mb: 6, color: 'text.primary' }}>
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
          sx={{ borderRadius: 2, flexGrow: 1, minWidth: 300 }}
        />
        <Tooltip
          title={
            selectedProf !== null
              ? 'Display reviews'
              : 'Select a professor first'
          }
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              disabled={selectedProf === null}
              size="large"
            >
              Search
            </Button>
          </span>
        </Tooltip>
      </Box>
      {reviewProf ? (
        <>
          <Card
            sx={{
              width: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <CardContent>
              <Typography variant="h5" color="primary">
                Showing reviews for
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Name:</strong> {reviewProf.name}
              </Typography>
              <Typography variant="body1" color="text.primary">
                <strong>Email:</strong> {reviewProf.email}
              </Typography>
              <ReviewInput
                endpoint={`/members/reviews/${reviewProf.email}`}
                onUpdate={handleSearch}
              />
            </CardContent>
          </Card>
          <ReviewList reviews={reviewsList} />
        </>
      ) : (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontStyle: 'italic' }}
        >
          Please enter an option in the dropdown and then hit search.
        </Typography>
      )}
    </Container>
  );
};

export default Profs;
