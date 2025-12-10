import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

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
      {recommendations.length > 0 && (
        
      )}
    </Box>
  )
}

export default ActivityDetail
