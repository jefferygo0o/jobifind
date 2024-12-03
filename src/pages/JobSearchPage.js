import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Grid, Typography, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchJobData } from "../utils/api";
import JobCard from "../components/JobCard";

const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    salary: '',
    jobType: ''
  });
  const [hasMore, setHasMore] = useState(true);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearch = async () => {
    setJobs([]); // Reset jobs on each new search
    const filteredJobs = await fetchJobData(filters);
    setJobs(filteredJobs);
  };

  const fetchMoreJobs = async () => {
    const newJobs = await fetchJobData(filters); // Use the current filters to fetch more jobs
    if (newJobs.length === 0) {
      setHasMore(false);
    }
    setJobs((prevJobs) => [...prevJobs, ...newJobs]);
  };

  useEffect(() => {
    fetchMoreJobs(); // Initial job fetch
  }, [filters]);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Job Search
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              label="Category"
            >
              <MenuItem value="technology">Technology</MenuItem>
              <MenuItem value="finance">Finance</MenuItem>
              <MenuItem value="marketing">Marketing</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <Select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              label="Location"
            >
              <MenuItem value="London">London</MenuItem>
              <MenuItem value="Manchester">Manchester</MenuItem>
              <MenuItem value="Remote">Remote</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Salary</InputLabel>
            <Select
              name="salary"
              value={filters.salary}
              onChange={handleFilterChange}
              label="Salary"
            >
              <MenuItem value="20000-30000">£20,000 - £30,000</MenuItem>
              <MenuItem value="30000-50000">£30,000 - £50,000</MenuItem>
              <MenuItem value="50000+">£50,000+</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Job Type</InputLabel>
            <Select
              name="jobType"
              value={filters.jobType}
              onChange={handleFilterChange}
              label="Job Type"
            >
              <MenuItem value="full-time">Full-Time</MenuItem>
              <MenuItem value="part-time">Part-Time</MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} mt={2}>
          <Button variant="contained" onClick={handleSearch}>Search</Button>
        </Grid>
      </Grid>

      <InfiniteScroll
        dataLength={jobs.length}
        next={fetchMoreJobs}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more jobs to display.</p>}
      >
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <JobCard job={job} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
};

export default JobSearchPage;
