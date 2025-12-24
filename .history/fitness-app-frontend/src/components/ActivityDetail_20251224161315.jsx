import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Box, Card, CardContent, Typography, CircularProgress, Alert, Chip, Button, Divider } from '@mui/material'
import { getActivities } from '../services/api'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import PoolIcon from '@mui/icons-material/Pool'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import TimerIcon from '@mui/icons-material/Timer'
import PsychologyIcon from '@mui/icons-material/Psychology'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    const iconProps = { sx: { fontSize: 60 } }
    switch(type?.toUpperCase()) {
      case 'RUNNING':
        return <DirectionsRunIcon {...iconProps} sx={{ ...iconProps.sx, color: '#667eea' }} />
      case 'CYCLING':
        return <DirectionsBikeIcon {...iconProps} sx={{ ...iconProps.sx, color: '#764ba2' }} />
      case 'WALKING':
        return <DirectionsWalkIcon {...iconProps} sx={{ ...iconProps.sx, color: '#f093fb' }} />
      case 'SWIMMING':
        return <PoolIcon {...iconProps} sx={{ ...iconProps.sx, color: '#4facfe' }} />
      case 'GYM':
        return <FitnessCenterIcon {...iconProps} sx={{ ...iconProps.sx, color: '#43e97b' }} />
      default:
        return <FitnessCenterIcon {...iconProps} sx={{ ...iconProps.sx, color: '#667eea' }} />
    }
  }

  const getActivityColor = (type) => {
    switch(type?.toUpperCase()) {
      case 'RUNNING':
        return { primary: '#667eea', secondary: '#764ba2' }
      case 'CYCLING':
        return { primary: '#764ba2', secondary: '#667eea' }
      case 'WALKING':
        return { primary: '#f093fb', secondary: '#f5576c' }
      case 'SWIMMING':
        return { primary: '#4facfe', secondary: '#00f2fe' }
      case 'GYM':
        return { primary: '#43e97b', secondary: '#38f9d7' }
      default:
        return { primary: '#667eea', secondary: '#764ba2' }
    }
  }
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recomLoading, setRecomLoading] = useState(false);

  const fetchRecommendations = async (activityId) => {
    try {
      setRecomLoading(true);
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('userid');
      
      console.log('Fetching recommendations for activity:', activityId);
      console.log('Token:', token ? 'exists' : 'missing');
      console.log('User ID:', userid);
      
      const response = await fetch(`http://localhost:8080/api/recommendations/activity/${activityId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-ID': userid
        }
      });
      
      console.log('Recommendations response status:', response.status);
      const text = await response.text();
      console.log('Recommendations response body:', text);
      
      if (response.ok && text) {
        try {
          const data = JSON.parse(text);
          console.log('Parsed recommendations:', data);
          setRecommendations(Array.isArray(data) ? data : [data]);
        } catch (parseError) {
          console.error('Failed to parse recommendations JSON:', parseError);
          setRecommendations([]);
        }
      } else {
        console.log('Recommendations not available');
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setRecommendations([]);
    } finally {
      setRecomLoading(false);
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch all activities and find the one with matching ID
        const response = await getActivities();
        const activities = response.data;
        const foundActivity = activities.find(act => act.id === id);
        
        if (foundActivity) {
          setActivity(foundActivity);
          // Fetch recommendations after activity is found
          fetchRecommendations(id);
        } else {
          setError('Activity not found');
        }
      } catch (error) {
        console.error('Error fetching activity:', error);
        setError('Failed to load activity details. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, minHeight: '60vh', justifyContent: 'center' }}>
        <CircularProgress size={60} sx={{ color: '#667eea' }} />
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
          Loading activity details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: 'white', fontWeight: 600 }}
        >
          Back to Activities
        </Button>
        <Card sx={{ 
          backgroundColor: 'rgba(255, 235, 238, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(244, 67, 54, 0.3)'
        }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <WarningAmberIcon sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#d32f2f', mb: 2 }}>Error</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>{error}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              The recommendations service is temporarily unavailable. 
              The activity may still be available on the list view.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: 'white', fontWeight: 600 }}
        >
          Back to Activities
        </Button>
        <Card sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          textAlign: 'center',
          p: 4
        }}>
          <CardContent>
            <FitnessCenterIcon sx={{ fontSize: 80, color: '#667eea', opacity: 0.5, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#667eea', mb: 1 }}>Activity not found</Typography>
            <Typography color="text.secondary">The activity you're looking for doesn't exist.</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const colors = getActivityColor(activity.type);

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ 
          mb: 3, 
          color: 'white', 
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        }}
      >
        Back to Activities
      </Button>

      {/* Activity Details Card */}
      <Card sx={{ 
        mb: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
          borderRadius: '3px 3px 0 0'
        }
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Box sx={{ 
              p: 2, 
              borderRadius: 3, 
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}15)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getActivityIcon(activity.type)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
                {activity.type || 'Activity'}
              </Typography>
              <Chip 
                label={activity.type || 'Unknown'}
                size="medium"
                sx={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.875rem'
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {activity.duration && (
              <Box sx={{ 
                flex: 1, 
                minWidth: '200px',
                p: 2.5, 
                borderRadius: 2, 
                backgroundColor: '#f5f7fa',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <TimerIcon sx={{ fontSize: 40, color: colors.primary }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Duration
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: colors.primary }}>
                    {activity.duration} min
                  </Typography>
                </Box>
              </Box>
            )}
            
            {activity.caloriesBurned && (
              <Box sx={{ 
                flex: 1, 
                minWidth: '200px',
                p: 2.5, 
                borderRadius: 2, 
                backgroundColor: '#fff3e0',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#ff6b6b' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Calories Burned
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff6b6b' }}>
                    {activity.caloriesBurned} kcal
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
      
      {/* AI Recommendations Section */}
      {recomLoading ? (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', 
          p: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          gap: 2
        }}>
          <CircularProgress size={50} sx={{ color: colors.primary }} />
          <Typography variant="h6" sx={{ color: colors.primary, fontWeight: 500 }}>
            AI is analyzing your workout...
          </Typography>
        </Box>
      ) : recommendations && recommendations.length > 0 ? (
        <Card sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <PsychologyIcon sx={{ fontSize: 40, color: colors.primary }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#333' }}>
                AI-Powered Insights
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {recommendations.map((rec, index) => (
                <Box key={index}>
                  {rec.recommendation && (
                    <Box sx={{ 
                      mb: 3,
                      p: 3, 
                      background: `linear-gradient(135deg, ${colors.primary}08, ${colors.secondary}08)`,
                      borderRadius: 2,
                      borderLeft: `4px solid ${colors.primary}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <LightbulbIcon sx={{ color: colors.primary, fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: colors.primary }}>
                          Main Analysis
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                        {rec.recommendation}
                      </Typography>
                    </Box>
                  )}
                  
                  {rec.improvements && Array.isArray(rec.improvements) && rec.improvements.length > 0 && (
                    <Box sx={{ 
                      mb: 3,
                      p: 3, 
                      backgroundColor: '#e8f5e9',
                      borderRadius: 2,
                      borderLeft: '4px solid #4caf50'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>
                          Areas for Improvement
                        </Typography>
                      </Box>
                      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                        {rec.improvements.map((improvement, i) => (
                          <Typography component="li" key={i} variant="body1" sx={{ color: 'text.primary', mb: 1, lineHeight: 1.7 }}>
                            {improvement}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {rec.suggestions && Array.isArray(rec.suggestions) && rec.suggestions.length > 0 && (
                    <Box sx={{ 
                      mb: 3,
                      p: 3, 
                      backgroundColor: '#e3f2fd',
                      borderRadius: 2,
                      borderLeft: '4px solid #2196f3'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <LightbulbIcon sx={{ color: '#2196f3', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1565c0' }}>
                          Suggestions
                        </Typography>
                      </Box>
                      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                        {rec.suggestions.map((suggestion, i) => (
                          <Typography component="li" key={i} variant="body1" sx={{ color: 'text.primary', mb: 1, lineHeight: 1.7 }}>
                            {suggestion}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {rec.safety && Array.isArray(rec.safety) && rec.safety.length > 0 && (
                    <Box sx={{ 
                      p: 3, 
                      backgroundColor: '#fff3e0',
                      borderRadius: 2,
                      borderLeft: '4px solid #ff9800'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <WarningAmberIcon sx={{ color: '#ff9800', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#e65100' }}>
                          Safety Guidelines
                        </Typography>
                      </Box>
                      <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                        {rec.safety.map((safetyTip, i) => (
                          <Typography component="li" key={i} variant="body1" sx={{ color: 'text.primary', mb: 1, lineHeight: 1.7 }}>
                            {safetyTip}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Alert 
          severity="info"
          sx={{ 
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(33, 150, 243, 0.3)',
            fontSize: '1rem'
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            No AI recommendations available for this activity yet. Check back in a moment!
          </Typography>
        </Alert>
      )}
    </Box>
  )
}

export default ActivityDetail
