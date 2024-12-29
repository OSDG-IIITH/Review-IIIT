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
import { ProfType } from '../types';
import SortBox from '../components/SortBox';
import { reviewableEqual, reviewableSort } from '../sortutils';

const Profs: React.FC<{ profList: ProfType[] | undefined }> = ({
  profList,
}) => {
  const [selectedProfs, setSelectedProfs] = useState<ProfType[]>([]);
  const [displayProfs, setDisplayProfs] = useState<ProfType[]>([]);

  if (profList === undefined) {
    return <FullPageLoader />;
  }

  if (displayProfs.length === 0 && profList.length !== 0) {
    setSelectedProfs(profList);
    setDisplayProfs(profList);
  }

  return (
    <Container sx={{ mt: 3, mb: 3, color: 'text.primary' }}>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        Professor Reviews
      </Typography>
      <Typography variant="h5" color="secondary" gutterBottom>
        Filter
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ width: '100%', mb: 2 }}
      >
        <Autocomplete
          multiple
          options={profList}
          autoComplete={true}
          autoHighlight={true}
          getOptionLabel={(option) => `${option.name} <${option.email}>`}
          onChange={(event, newValue) =>
            setSelectedProfs(newValue.length ? newValue : profList)
          }
          renderInput={(params) => (
            <TextField {...params} label="Search (by name or email)" />
          )}
          sx={{ borderRadius: 2, width: '100%' }}
          size="small"
        />
        <Tooltip
          title={
            reviewableEqual(selectedProfs, profList)
              ? 'Clear filter and display all professors'
              : 'Apply filter and display only selected professors'
          }
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDisplayProfs(reviewableSort(selectedProfs))}
              disabled={reviewableEqual(displayProfs, selectedProfs)}
              size="small"
              sx={{ minWidth: '95px' }}
            >
              {reviewableEqual(selectedProfs, profList)
                ? 'Clear filter'
                : 'Apply filter'}
            </Button>
          </span>
        </Tooltip>
      </Box>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ mb: 3, fontStyle: 'italic' }}
      >
        This filter allows you to select one or more professors to display
        reviews for. To clear this filter and display all, leave this empty.
      </Typography>
      <SortBox sortableData={displayProfs} setSortableData={setDisplayProfs} />
      <Typography variant="h5" color="secondary" gutterBottom>
        Reviews
      </Typography>
      {displayProfs.length > 0 ? (
        displayProfs.map((prof, index) => (
          <ReviewBox
            key={index}
            title={prof.name}
            endpoint={`/members/reviews/${prof.email}`}
            initExpanded={displayProfs.length < 10}
          >
            {prof.email}
          </ReviewBox>
        ))
      ) : (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontStyle: 'italic' }}
        >
          No reviews available.
        </Typography>
      )}
    </Container>
  );
};

export default Profs;
