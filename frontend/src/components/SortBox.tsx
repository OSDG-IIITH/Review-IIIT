import React, { useEffect, useState } from 'react';
import { ReviewableType, SortType } from '../types';
import {
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
} from '@mui/material';
import { reviewableDefaultSortString, reviewableSort } from '../sortutils';

type SortBoxProps<T extends ReviewableType> = {
  sortableData: T[];
  setSortableData: (value: T[]) => void;
};

const SortBox = <T extends ReviewableType>({
  sortableData,
  setSortableData,
}: SortBoxProps<T>): React.ReactElement => {
  const [sortBy, setSortBy] = useState<SortType | ''>('');
  const [sortByAscending, setSortByAscending] = useState<boolean>(false);

  const handleSortChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: SortType | null
  ) => {
    if (newValue !== null && newValue !== sortBy) {
      setSortBy(newValue);
    }
  };
  const handleSortAscendingChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: boolean | null
  ) => {
    if (newValue !== null && newValue !== sortByAscending) {
      setSortByAscending(newValue);
    }
  };

  useEffect(() => {
    setSortableData(reviewableSort(sortableData, sortBy, sortByAscending));
  }, [sortBy, sortByAscending]);

  // Reset sort criteria to defaults if data changes in parent
  useEffect(() => {
    setSortBy('');
    setSortByAscending(false);
  }, [reviewableDefaultSortString(sortableData)]);

  const disableForSize = sortableData === null || sortableData.length <= 1;
  return (
    <>
      <Typography variant="h5" color="secondary" gutterBottom>
        Sort By
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
        <ToggleButtonGroup
          color="primary"
          value={sortBy}
          exclusive
          onChange={handleSortChange}
          size="small"
          disabled={disableForSize}
        >
          <ToggleButton value="">None</ToggleButton>
          <ToggleButton value="num_reviews">No. of reviews</ToggleButton>
          <ToggleButton value="avg_rating">Average rating</ToggleButton>
          <ToggleButton value="newest_dtime">Most recent comment</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="primary"
          value={sortBy ? sortByAscending : null}
          exclusive
          onChange={handleSortAscendingChange}
          size="small"
          disabled={disableForSize || !sortBy}
        >
          <ToggleButton value={true}>Ascending</ToggleButton>
          <ToggleButton value={false}>Descending</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ mt: 1, mb: 3, fontStyle: 'italic' }}
      >
        You can pick parameters to sort the boxes displayed.
        {sortBy && ' All the boxes with no reviews will be at the bottom.'}
      </Typography>
    </>
  );
};

export default SortBox;
