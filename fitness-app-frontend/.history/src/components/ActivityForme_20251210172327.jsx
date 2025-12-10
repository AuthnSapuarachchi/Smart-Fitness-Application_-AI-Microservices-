import React from 'react'
import { Box, FormControl } from '@mui/material'
import { useState } from 'react'
import { addActivity } from '../api'


const ActivityForme = () => {

  const [activity, setActivity] = useState({type:  "RUNNING", distance: '', caloriesBurned: '', additionalMetrics: {}});

  const handleSubmit =  async(e) => {
  e.preventDefault()
  try{
    await addActivity(activity);
    onActivityAdded();
    setActivity({type:  "RUNNING", distance: '', caloriesBurned: ''});
  } catch (error) {
    
  }
}

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <FormControl fullWidth></FormControl>
    </Box>
  )
}

export default ActivityForme
