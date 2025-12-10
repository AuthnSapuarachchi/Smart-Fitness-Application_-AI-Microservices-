import { Grid } from '@mui/material'
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActivities } from '../services/api';

const ActivityList = () => {

const [activities, setActivitoes] = useState([]);
const navigate = useNavigate();

const fetchActivities = async () => {
  try {
    const response = await getActivities();
    const data = response.data;
    setActivitoes(data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <Grid container spacing={2}>
      
    </Grid>
  )
}

export default ActivityList
