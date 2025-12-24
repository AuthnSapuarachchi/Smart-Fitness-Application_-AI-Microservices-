import React from 'react'
import { Box, Typography } from '@mui/material'

const WelcomeSection = ({ user }) => {
  const currentHour = new Date().getHours()
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'
  
  return (
      <Box 
        sx={{ 
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1
          }}
        >
          {greeting}, {user?.preferred_username || user?.name || 'User'}! 👋
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '1rem'
          }}
        >
          Ready to track your fitness journey? Log your activities and get AI-powered insights.
        </Typography>
      </Box>
    )
  }