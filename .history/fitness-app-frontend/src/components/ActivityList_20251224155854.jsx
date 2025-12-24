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
    <Box sx={{ mt: 3 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            color: 'white',
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Your Activities
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
          {activities.length} workout{activities.length !== 1 ? 's' : ''} tracked
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {activities.map((activity) => {
          const colors = getActivityColor(activity.type)
          return (
            <Grid item key={activity.id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  cursor: 'pointer',
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'visible',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    '& .activity-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
                onClick={() => navigate(`/activities/${activity.id}`)}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Activity Icon and Type */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box className="activity-icon" sx={{ transition: 'all 0.3s ease' }}>
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Chip 
                      label={activity.type || 'Unknown'}
                      size="small"
                      sx={{ 
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </Box>

                  {/* Activity Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {activity.duration && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimerIcon sx={{ fontSize: 20, color: colors.primary }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {activity.duration} minutes
                        </Typography>
                      </Box>
                    )}
                    
                    {activity.caloriesBurned && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalFireDepartmentIcon sx={{ fontSize: 20, color: '#ff6b6b' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {activity.caloriesBurned} calories
                        </Typography>
                      </Box>
                    )}

                    {!activity.duration && !activity.caloriesBurned && (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No details available
                      </Typography>
                    )}
                  </Box>

                  {/* View Details Button */}
                  <Box 
                    sx={{ 
                      mt: 2.5, 
                      pt: 2, 
                      borderTop: '1px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.primary,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      View AI Insights
                      <TrendingUpIcon sx={{ fontSize: 16 }} />
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}

export default ActivityList
