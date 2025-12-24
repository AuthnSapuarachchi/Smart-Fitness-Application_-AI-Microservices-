import { Grid, Card, CardContent, Typography, Box, Chip, CircularProgress } from '@mui/material'
import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActivities } from '../services/api'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import TimerIcon from '@mui/icons-material/Timer'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const ActivityList = () => {

const [activities, setActivities] = useState([]);
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

// Get activity icon based on type
const getActivityIcon = (type) => {
  switch(type?.toUpperCase()) {
    case 'RUNNING':
      return <DirectionsRunIcon sx={{ fontSize: 40, color: '#667eea' }} />
    case 'CYCLING':
      return <DirectionsBikeIcon sx={{ fontSize: 40, color: '#764ba2' }} />
    case 'WALKING':
      return <DirectionsWalkIcon sx={{ fontSize: 40, color: '#f093fb' }} />
    case 'GYM':
      return <FitnessCenterIcon sx={{ fontSize: 40, color: '#4facfe' }} />
    default:
      return <FitnessCenterIcon sx={{ fontSize: 40, color: '#667eea' }} />
  }
}

// Get activity color based on type
const getActivityColor = (type) => {
  switch(type?.toUpperCase()) {
    case 'RUNNING':
      return { primary: '#667eea', secondary: '#764ba2' }
    case 'CYCLING':
      return { primary: '#764ba2', secondary: '#667eea' }
    case 'WALKING':
      return { primary: '#f093fb', secondary: '#f5576c' }
    case 'GYM':
      return { primary: '#4facfe', secondary: '#00f2fe' }
    default:
      return { primary: '#667eea', secondary: '#764ba2' }
  }
}

const fetchActivities = async () => {
  try {
    setLoading(true);
    const response = await getActivities();
    const data = response.data;
    console.log('Activities fetched:', data);
    setActivities(data);
  } catch (error) {
    console.error('Error fetching activities:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchActivities();
}, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
        <CircularProgress size={50} sx={{ color: '#667eea' }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
          Loading your activities...
        </Typography>
      </Box>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <Box 
        sx={{ 
          textAlign: 'center', 
          mt: 4, 
          p: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)'
        }}
      >
        <FitnessCenterIcon sx={{ fontSize: 80, color: '#667eea', mb: 2, opacity: 0.5 }} />
        <Typography variant="h5" sx={{ color: '#667eea', fontWeight: 600, mb: 1 }}>
          No activities yet
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Add your first workout to get started! 💪
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={2}>
      {activities.map((activity) => (
        <Grid item key={activity.id} xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { boxShadow: 6 },
              transition: 'all 0.3s ease'
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                {activity.type || 'Unknown Activity'}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {activity.distance && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>Duration:</strong> {activity.distance} minutes
                  </Typography>
                )}
                {activity.caloriesBurned && (
                  <Typography variant="body2" color="textSecondary">
                    <strong>Calories:</strong> {activity.caloriesBurned} kcal
                  </Typography>
                )}
                {!activity.distance && !activity.caloriesBurned && (
                  <Typography variant="body2" color="textSecondary">
                    No details available
                  </Typography>
                )}
                <Typography variant="caption" color="primary" sx={{ mt: 1 }}>
                  Click to view details →
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ActivityList
