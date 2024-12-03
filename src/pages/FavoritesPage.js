import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import { getFavorites, removeFavoriteJob } from "../utils/firebase";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites();
      setFavorites(Object.values(data));
    };
    fetchFavorites();
  }, []);

  const handleRemove = async (jobId) => {
    await removeFavoriteJob(jobId);
    setFavorites((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Favorite Jobs
      </Typography>
      <Grid container spacing={2}>
        {favorites.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography>{job.company}</Typography>
                <Typography>{job.location}</Typography>
              </CardContent>
              <Button onClick={() => handleRemove(job.id)}>Remove</Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FavoritesPage;
