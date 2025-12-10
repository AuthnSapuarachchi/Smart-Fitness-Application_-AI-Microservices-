import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Divider } from '@mui/material';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try{
        const response = await getActivityDetails(id);
        setActivity(response.data);
        setRecommendations(response.data.recommendations);
      } catch (error) {
        console.error(error);
      }
    }

    fetchActivityDetails();
  }, [id]);

  if (!activity) {
    return <div>Loading...</div>;
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
        </CardContent>
      </Card>
      {recommendations > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              AI Recommendations
            </Typography>
            <Typography variant="h5">
              Analysis
            </Typography>
            <Typography paragraph>
              {activity.recommendations}
            </Typography>

            <Divider sx={{my:2}} />

            <Typography variant="h5">
              Improvements
            </Typography>
            {activity?.improvments?.map((improvement, index) => (
              <Typography key={index} paragraph>
                {activity.improvements}
              </Typography>
            ))}
            <Typography paragraph>
              {activity.recommendations}
            </Typography>
            
            <Divider sx={{my:2}} />

            <Typography variant="h5">
              Suggestions
            </Typography>
            {activity?.suggestions?.map((suggestion, index) => (
              <Typography key={index} paragraph>
                {activity.suggestions}
              </Typography>
            ))}

            <Divider sx={{my:2}} />

            <Typography variant="h5">
              Safety Guidlines
            </Typography>
            {activity?.sa?.map((tip, index) => (
              <Typography key={index} paragraph>
                {activity.tips}
              </Typography>
            ))}
            
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default ActivityDetail
