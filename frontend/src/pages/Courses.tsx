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
import { CourseType, NameAndCode, ProfType } from '../types';
import SortBox from '../components/SortBox';
import { semCompare, reviewableSort } from '../sortutils';

function getProfStub(email: string): ProfType {
  return {
    name: email,
    email: email,
    reviews_metadata: {
      num_reviews: 0,
      newest_dtime: null,
      avg_rating: null,
    },
  };
}

const Courses: React.FC<{
  courseList: CourseType[] | undefined;
  profMap: Map<string, ProfType> | undefined;
}> = ({ courseList, profMap }) => {
  const [semFilter, setSemFilter] = useState<string | null>(null);
  const [codeFilter, setCodeFilter] = useState<NameAndCode | null>(null);
  const [profFilter, setProfFilter] = useState<ProfType | null>(null);
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);

  const applyFilters = () => {
    if (!semFilter && !codeFilter && !profFilter) {
      /* No filters chosen */
      setFilteredCourses([]);
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
      setFilteredCourses(reviewableSort(filtered));
    }
  };

  if (courseList === undefined || profMap === undefined) {
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
  ).sort(semCompare);

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
    .map((email) => profMap.get(email) || getProfStub(email))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Container sx={{ mt: 3, mb: 3, color: 'text.primary' }}>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        Course Reviews
      </Typography>
      <Typography variant="h5" color="secondary" gutterBottom>
        Filters
      </Typography>
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
      <Typography
        variant="body2"
        color="text.primary"
        sx={{ mb: 3, fontStyle: 'italic' }}
      >
        All filters are optional but you have to set atleast one of the three.
      </Typography>
      <SortBox
        sortableData={filteredCourses}
        setSortableData={setFilteredCourses}
      />
      <Typography variant="h5" color="secondary" gutterBottom>
        Reviews
      </Typography>
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course, index) => (
          <ReviewBox
            key={index}
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
      ) : (
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ fontStyle: 'italic' }}
        >
          No matches found, make sure to hit the search button after picking the
          filter(s).
        </Typography>
      )}
    </Container>
  );
};

export default Courses;
