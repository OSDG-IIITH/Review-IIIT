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

const Courses = ({ courseList, profMap }) => {
  const [semFilter, setSemFilter] = useState(null);
  const [codeFilter, setCodeFilter] = useState(null);
  const [profFilter, setProfFilter] = useState(null);
  const [filteredCourses, setFilteredCourses] = useState(null);

  const applyFilters = () => {
    if (!semFilter && !codeFilter && !profFilter) {
      /* No filters chosen */
      setFilteredCourses(null);
      return;
    }
    if (courseList) {
      const filtered = courseList.filter((course) => {
        const matchesSem = semFilter ? course.sem === semFilter : true;
        const matchesCode = codeFilter ? course.code === codeFilter.code : true;
        const matchesProf = profFilter
          ? course.profs.includes(profFilter.email)
          : true;
        return matchesSem && matchesCode && matchesProf;
      });
      setFilteredCourses(filtered);
    }
  };

  if (courseList === null || profMap === null) {
    return <FullPageLoader />;
  }

  const semOptions = Array.from(
    new Set(
      courseList
        .filter(
          (course) =>
            (!codeFilter || course.code === codeFilter.code) &&
            (!profFilter || course.profs.includes(profFilter.email))
        )
        .map((course) => course.sem)
    )
  );

  const seen = new Set();
  const codeOptions = courseList
    .filter((course) => {
      if (semFilter && course.sem !== semFilter) {
        return false;
      }
      if (profFilter && !course.profs.includes(profFilter.email)) {
        return false;
      }
      const identifier = `${course.code}-${course.name}`;
      if (seen.has(identifier)) {
        return false;
      }
      seen.add(identifier);
      return true;
    })
    .map((course) => ({ code: course.code, name: course.name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const profOptions = Array.from(
    new Set(
      courseList
        .filter(
          (course) =>
            (!codeFilter || course.code === codeFilter.code) &&
            (!semFilter || course.sem === semFilter)
        )
        .flatMap((course) => course.profs)
    )
  )
    .map((email) => profMap.get(email))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container sx={{ mt: 3, mb: 3, color: 'text.primary' }}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ width: '100%', mb: 1 }}
      >
        <Autocomplete
          options={semOptions}
          autoComplete={true}
          autoHighlight={true}
          onChange={(event, newValue) => setSemFilter(newValue)}
          renderInput={(params) => <TextField {...params} label="Semester" />}
          sx={{ minWidth: 120 }} // this magic number is based on length of label
          size="small"
        />
        <Autocomplete
          options={codeOptions}
          autoComplete={true}
          autoHighlight={true}
          getOptionLabel={(option) => `[${option.code}] ${option.name}`}
          onChange={(event, newValue) => setCodeFilter(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Course (name or code)" />
          )}
          sx={{ flexGrow: 1 }}
          size="small"
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ width: '100%', mb: 1 }}
        size="small"
      >
        <Autocomplete
          options={profOptions}
          autoComplete={true}
          autoHighlight={true}
          getOptionLabel={(option) => `${option.name} <${option.email}>`}
          onChange={(event, newValue) => setProfFilter(newValue)}
          renderInput={(params) => <TextField {...params} label="Professor" />}
          sx={{ flexGrow: 1 }}
          size="small"
        />
        <Tooltip
          title={
            semFilter || codeFilter || profFilter
              ? 'Apply the filters and display selections'
              : 'Pick filters first'
          }
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={applyFilters}
              disabled={!(semFilter || codeFilter || profFilter)}
              size="small"
              sx={{ width: '100%' }}
            >
              Search
            </Button>
          </span>
        </Tooltip>
      </Box>
      {filteredCourses ? (
        filteredCourses.length <= 0 ? (
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontStyle: 'italic' }}
          >
            No match found for given filters.
          </Typography>
        ) : (
          filteredCourses.map((course, index) => (
            <ReviewBox
              title={`[${course.code}] ${course.name} (${course.sem})`}
              endpoint={`/courses/reviews/${course.sem}/${course.code}`}
              initExpanded={filteredCourses.length < 10}
            >
              {course.profs.map((email) => {
                const prof = profMap.get(email);
                return prof ? (
                  <Typography variant="body1" color="text.primary" key={email}>
                    {prof.name} &lt;{email}&gt;
                  </Typography>
                ) : null;
              })}
            </ReviewBox>
          ))
        )
      ) : (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontStyle: 'italic' }}
        >
          All filters are optional but you have to set atleast one of the three.
          Hit search after choosing your filter(s).
        </Typography>
      )}
    </Container>
  );
};

export default Courses;
