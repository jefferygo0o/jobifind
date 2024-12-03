import React from "react";
import { Card, CardContent, CardActions, Typography, Button } from "@mui/material";

const JobCard = ({ job }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
          {job.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          {job.company}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          Location: {job.location}
        </Typography>
        {job.salary_min && job.salary_max && (
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
            Salary: £{job.salary_min} - £{job.salary_max}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
          {job.contract_type}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" color="primary" href={job.url} target="_blank" rel="noopener noreferrer">
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
