import React, { useState } from "react";
import { TextField, Button, Box, Typography, Grid, Card, CardContent, CardActions, Link } from "@mui/material";
import { searchJobs } from "../utils/api";

const JobSearchPage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await searchJobs(query, location);
      setJobs(results);
    } catch (error) {
      alert("Error fetching jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5, px: 2 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Job Search
      </Typography>
      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Job Title or Keywords"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <TextField
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </Box>
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {job.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company.display_name} - {job.location.display_name}
                </Typography>
                {job.salary_min && (
                  <Typography variant="body2">
                    Salary: £{job.salary_min} - £{job.salary_max}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  href={job.redirect_url}
                  target="_blank"
                >
                  Apply
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {jobs.length === 0 && !loading && (
        <Typography textAlign="center" color="text.secondary">
          No jobs found. Try adjusting your search criteria.
        </Typography>
      )}
    </Box>
  );
};

export default JobSearchPage;
