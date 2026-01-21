import React from 'react'
import { Box, Card, Typography } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import WelcomeSection from '../components/WelcomeSection'
import ActivityForme from '../components/ActivityForme'
import ActivityList from '../components/ActivityList'

const ActivityPage = ({ user }) => {
  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: { xs: 2, md: 3 }
    }}>
      <WelcomeSection user={user} />
      
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        mt: 3,
        alignItems: 'stretch'
      }}>
        {/* Left Side - Activity Form */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
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
        </Box>

        {/* Right Side - Activity List */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
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
          </Card>
        </Box>
      </Box>
    </Box>
  )
}

export default ActivityPage