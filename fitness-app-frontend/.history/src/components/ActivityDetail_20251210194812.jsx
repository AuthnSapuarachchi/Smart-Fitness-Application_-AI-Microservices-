import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { getActivities } from '../services/api';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getActivityDetails(id);
        setActivity(response.data);
        setRecommendations(response.data.recommendations || []);
      } catch (error) {
        console.error('Error fetching activity details:', error);
        // For now, don't show error - just log it
        // The recommendations endpoint may not be fully implemented yet
        setActivity(null);
        setError('Recommendations unavailable, but activity data may load separately.');
      } finally {
        setLoading(false);
      }
    }

    fetchActivityDetails();
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
          <Typography variant="h5" component="div">
            {activity.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Distance: {activity.distance} km
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Calories Burned: {activity.caloriesBurned}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Activity ID: {activity.id}
          </Typography>
        </CardContent>
      </Card>
      
      {recommendations && recommendations.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI Recommendations
            </Typography>
            <Typography paragraph>
              {JSON.stringify(recommendations, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ActivityDetail
