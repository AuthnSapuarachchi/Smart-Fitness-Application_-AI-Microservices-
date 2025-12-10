import React from 'react'
import { Box } from '@mui/material'

const handleSubmit =  async(e) => {
  e.preventDefault()
  try{
    await addActivity(activity);
    onActivityAdded();
    setActivity({type:  })
  } catch (error) {
    
  }
}

const ActivityForme = () => {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      This Box renders as an HTML section element.
    </Box>
  )
}

export default ActivityForme
