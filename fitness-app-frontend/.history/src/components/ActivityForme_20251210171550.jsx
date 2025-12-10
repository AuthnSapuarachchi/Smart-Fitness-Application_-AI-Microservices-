import React from 'react'
import { Box } from '@mui/material'

const handleSubmit =  ay=(e) => {
  event.preventDefault()
  console.log('Form submitted')
}

const ActivityForme = () => {
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      This Box renders as an HTML section element.
    </Box>
  )
}

export default ActivityForme
