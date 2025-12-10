import { Grid } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ActivityList = () => {

const [activities, setActivitoes] = useState([]);
const navigate = useNavigate();

const fetchActivities = async () => {
  try {

  } catch (error) {
    console.error()
  }
};
  try {
    const response = await fetch('http://localhost:8080/activities');
    const data = await response.json();
    setActivitoes(data);
  } catch (error) {
    console.error('Error fetching activities:', error);
  }
};

  return (
    <Grid container spacing={2}>
      
    </Grid>
  )
}

export default ActivityList
