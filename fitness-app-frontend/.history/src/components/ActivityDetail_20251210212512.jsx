import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material'
import { getActivities } from '../services/api';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
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
      <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
        <Card>
          <CardContent>
            <Typography>Loading activity details...</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
        <Card sx={{ backgroundColor: '#ffebee' }}>
          <CardContent>
            <Typography variant="h6" color="error">Error</Typography>
            <Typography color="textSecondary">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
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
      <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
        <Card>
          <CardContent>
            <Typography color="error">Activity not found</Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', p: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
            {activity.type || 'Activity'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {activity.distance && (
              <Typography variant="body2" color="text.secondary">
                <strong>Distance:</strong> {activity.distance} km
              </Typography>
            )}
            {activity.caloriesBurned && (
              <Typography variant="body2" color="text.secondary">
                <strong>Calories Burned:</strong> {activity.caloriesBurned} kcal
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              <strong>Activity ID:</strong> {activity.id}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {recomLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={30} />
        </Box>
      ) : recommendations && recommendations.length > 0 ? (
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              🤖 AI Recommendations
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recommendations.map((rec, index) => (
                <Box key={index} sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 1, borderLeft: '4px solid #1976d2', width: '100%', boxSizing: 'border-box' }}>
                  {rec.recommendation && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                        💡 Main Recommendation:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{rec.recommendation}</Typography>
                    </Box>
                  )}
                  
                  {rec.improvements && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#388e3c' }}>
                        ⬆️ Improvements:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{rec.improvements}</Typography>
                    </Box>
                  )}
                  
                  {rec.suggestions && (
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                        💬 Suggestions:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{rec.suggestions}</Typography>
                    </Box>
                  )}
                  
                  {rec.safety && (
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#f57c00' }}>
                        ⚠️ Safety Tips:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>{rec.safety}</Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Alert severity="info">No AI recommendations available for this activity yet.</Alert>
      )}
    </Box>
  )
}

export default ActivityDetail
