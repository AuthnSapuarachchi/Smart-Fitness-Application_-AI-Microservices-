import React from 'react'
import { Box, FormControl, InputLabel, MenuItem, TextField } from '@mui/material'
import { useState } from 'react'
import { addActivity } from '../api'


const ActivityForme = ({ onActivityAdded}) => {

  const [activity, setActivity] = useState({type:  "RUNNING", distance: '', caloriesBurned: '', additionalMetrics: {}});

  const handleSubmit =  async(e) => {
  e.preventDefault()
  try{
    //await addActivity(activity);
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
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
            <MenuItem value="SWIMMING">Swimming</MenuItem>
          </select>
      </FormControl>
      <TextField
        label="Duration (minutes)"
        type="number"
        value={activity.distance}
        onChange={(e) => setActivity({...activity, distance: e.target.value})}
        fullWidth
        sx={{mb: 2}}
      />
      <TextField
        label="Calories Burned"
        type="number"
        value={activity.caloriesBurned}
        onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
        fullWidth
        sx={{mb: 2}}
      />
      <button type="submit">Add Activity</button>
    </Box>
  )
}

export default ActivityForme
