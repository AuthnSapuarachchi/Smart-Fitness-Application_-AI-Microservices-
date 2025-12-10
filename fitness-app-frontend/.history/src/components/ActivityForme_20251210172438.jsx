import React from 'react'
import { Box, FormControl, InputLabel } from '@mui/material'
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
      <FormControl fullWidth sx={{mb: 2}}>
          <InputLabel>Activity Type</InputLabel>
          <select value={activity.type} onChange={(e) => setActivity({...activity, type: e.target.value})}>
            <option value="RUNNING">Running</option>
            <option value="CYCLING">Cycling</option>
            <option value="SWIMMING">Swimming</option>
          </select>
      </FormControl>
    </Box>
  )
}

export default ActivityForme
