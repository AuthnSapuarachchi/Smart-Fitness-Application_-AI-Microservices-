import React from 'react'
import { Box, Grid, Card, Typography } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WelcomeSection from '../components/WelcomeSection'
import ActivityForme from '../components/ActivityForme'
import ActivityList from '../components/ActivityList'

const ActivityPage = ({ user }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <WelcomeSection user={user} />
      <Grid container spacing={3} sx={{ width: '100%' }}>
        {/* Left Side - Activity Form */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0}
            sx={{ 
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              padding: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FitnessCenterIcon sx={{ fontSize: 28, color: '#667eea' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#667eea',
                }}
              >
                Log New Activity
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                mb: 3,
                fontSize: '0.95rem'
              }}
            >
              Fill in the details below to track your workout and receive personalized AI recommendations.
            </Typography>
            <ActivityForme onActivityAdded={() => window.location.reload()} />
          </Card>
        </Grid>

        {/* Right Side - Activity List */}
        <Grid item xs={12} md={6}>
          <Box>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2,
                px: 1
              }}
            >
              <DirectionsRunIcon sx={{ fontSize: 28, color: '#667eea' }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 700,
                  color: '#667eea',
                }}
              >
                Your Activities
              </Typography>
            </Box>
            <ActivityList />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ActivityPage