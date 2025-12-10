import React from 'react'
import { useParams } from 'react-router-dom'


const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  return (
    <div>
      
    </div>
  )
}

export default ActivityDetail
