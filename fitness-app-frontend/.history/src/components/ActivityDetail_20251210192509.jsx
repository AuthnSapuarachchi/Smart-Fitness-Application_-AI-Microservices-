import React from 'react'
import { useParams } from 'react-router-dom'
import { useState } from 'react'

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  

  return (
    <div>
      
    </div>
  )
}

export default ActivityDetail
