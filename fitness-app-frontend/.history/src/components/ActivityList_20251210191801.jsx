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
      {activities.map((activity) => (
        <Grid item key={activity.id} xs={12} sm={6} md={4}>
          <div
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => navigate(`/activity/${activity.id}`)}
          >
            <h3>{activity.type}</h3>
            <p>Distance: {activity.distance}</p>
            <p>Calories Burned: {activity.caloriesBurned}</p>
          </div>
        </Grid>
      ))}
    </Grid>
  )
}

export default ActivityList
