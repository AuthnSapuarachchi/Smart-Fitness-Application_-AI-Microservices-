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

      }
    }

    fetchActivityDetails();
  }, [id]);

  return (
    <div>
      
    </div>
  )
}

export default ActivityDetail
