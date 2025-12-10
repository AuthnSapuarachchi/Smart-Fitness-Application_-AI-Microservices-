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
      {recommendations > 0 && (
        <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
      )}
    </Box>
  )
}

export default ActivityDetail
