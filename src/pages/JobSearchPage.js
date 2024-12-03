import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchJobData } from "../utils/api";
import { applyForJob, getAppliedJobs } from "../utils/firebase";

const JobSearchPage = () => {
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    salaryMin: '',
    remoteOnly: false,
    category: '',
    salary: '',
    jobType: ''
  });
  const [jobs, setJobs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getAppliedJobs();
        setFavorites(favorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };
    fetchFavorites();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setJobs([]); // Reset jobs on each new search
    try {
      const results = await fetchJobData(filters); // Pass filters into API
      setJobs(results);
    } catch (error) {
      alert("Error fetching jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreJobs = async () => {
    setLoading(true);
    try {
      const newJobs = await fetchJobData(filters); // Fetch more jobs based on current filters
      if (newJobs.length === 0) {
        setHasMore(false);
      }
      setJobs((prevJobs) => [...prevJobs, ...newJobs]);
    } catch (error) {
      console.error('Error fetching more jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleApplyForJob = async (jobId) => {
    try {
      await applyForJob(jobId);
      alert("Job application submitted.");
    } catch (error) {
      console.error("Error applying for job:", error);
    }
  };

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Job Search
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Job Title or Keywords"
            fullWidth
            name="query"
            value={filters.query}
            onChange={handleFilterChange}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Location"
            fullWidth
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Minimum Salary"
            type="number"
            fullWidth
            name="salaryMin"
            value={filters.salaryMin}
            onChange={handleFilterChange}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={filters.remoteOnly}
                onChange={(e) => setFilters({ ...filters, remoteOnly: e.target.checked })}
              />
            }
            label="Remote Only"
          />
        </Grid>

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
            <InputLabel>Salary</InputLabel>
            <Select
              name="salary"
              value={filters.salary}
              onChange={handleFilterChange}
              label="Salary"
            >
              <MenuItem value="30000-40000">£30,000 - £40,000</MenuItem>
              <MenuItem value="40000-50000">£40,000 - £50,000</MenuItem>
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
              <MenuItem value="full-time">Full Time</MenuItem>
              <MenuItem value="part-time">Part Time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
          Search Jobs
        </Button>
      </Box>

      <InfiniteScroll
        dataLength={jobs.length}
        next={fetchMoreJobs}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p>No more jobs to load</p>}
      >
        <Grid container spacing={2} sx={{ mt: 3 }}>
          {jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.company.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.location.display_name}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    onClick={() => handleApplyForJob(job.id)}
                    color={favorites[job.id] ? "primary" : "default"}
                  >
                    {favorites[job.id] ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleApplyForJob(job.id)}
                    fullWidth
                  >
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>
    </Box>
  );
};

export default JobSearchPage;
