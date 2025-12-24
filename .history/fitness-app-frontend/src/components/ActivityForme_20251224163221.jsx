import React, { useState } from 'react'
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, Paper } from '@mui/material'
import { addActivity } from '../services/api'


const ActivityForme = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    distance: '',
    caloriesBurned: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!activity.distance || !activity.caloriesBurned) {
      alert('Please fill all fields')
      return
    }
    try {
      const userId = localStorage.getItem('userid')
      if (!userId) {
        alert('User not authenticated. Please login again.')
        return
      }
      const activityWithUserId = {
        ...activity,
        userId: userId
      }
      console.log('Submitting activity:', activityWithUserId)
      await addActivity(activityWithUserId);
      onActivityAdded()
      setActivity({ type: 'RUNNING', distance: '', caloriesBurned: '' })
      alert('Activity added successfully!')
    } catch (error) {
      console.error('Error adding activity:', error)
      alert('Failed to add activity. Check console for details.')
    }
  }

  return (
    <Paper sx={{ p: 3, mb: 3, width: '100%', maxWidth: 'none' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Add New Activity
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <FormControl fullWidth>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          >
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
            <MenuItem value="SWIMMING">Swimming</MenuItem>
          <MenuItem value="WALKING">Swimming</MenuItem>
            <MenuItem value="GYM">GYM</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Duration (minutes)"
          type="number"
          value={activity.distance}
          onChange={(e) => setActivity({ ...activity, distance: e.target.value })}
          fullWidth
          variant="outlined"
          placeholder="Enter duration in minutes"
        />

        <TextField
          label="Calories Burned"
          type="number"
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
          fullWidth
          variant="outlined"
          placeholder="Enter calories burned"
        />

        <Button
          type="submit"
          variant="contained"
          color="success"
          size="large"
          sx={{ mt: 1 }}
        >
          Add Activity
        </Button>
      </Box>
    </Paper>
  )
}

export default ActivityForme
