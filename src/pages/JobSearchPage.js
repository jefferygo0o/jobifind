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
import { searchJobs, fetchJobData } from "../utils/api";
import JobCard from "../components/JobCard";
import { addFavoriteJob, removeFavoriteJob, getFavorites } from "../utils/firebase";

const JobSearchPage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    salary: '',
    jobType: ''
  });
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavorites();
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
      const results = await searchJobs(query, location, salaryMin, remoteOnly);
      setJobs(results);
    } catch (error) {
      alert("Error fetching jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreJobs = async () => {
    const newJobs = await fetchJobData(filters); // Use the current filters to fetch more jobs
    if (newJobs.length === 0) {
      setHasMore(false);
    }
    setJobs((prevJobs) => [...prevJobs, ...newJobs]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const toggleFavorite = async (job) => {
    if (favorites[job.id]) {
      await removeFavoriteJob(job.id);
      setFavorites((prev) => {
        const updated = { ...prev };
        delete updated[job.id];
        return updated;
      });
    } else {
      await addFavoriteJob(job);
      setFavorites((prev) => ({ ...prev, [job.id]: job }));
    }
  };

  useEffect(() => {
    fetchMoreJobs(); // Initial job fetch
  }, [filters]);

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Location"
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Minimum Salary"
            type="number"
            fullWidth
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
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
          <Button variant="contained" onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
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
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {job.company} - {job.location}
                  </Typography>
                  {job.salary_min && (
                    <Typography variant="body2">
                      Salary: £{job.salary_min} - £{job.salary_max}
                    </Typography>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton onClick={() => toggleFavorite(job)} color="primary">
                    {favorites[job.id] ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Button size="small" href={job.redirect_url} target="_blank">
                    Apply
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
