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
    <Box sx={{ p: 2, border: '1px dashed grey' }}>
      
    </Box>
  )
}

export default ActivityDetail
