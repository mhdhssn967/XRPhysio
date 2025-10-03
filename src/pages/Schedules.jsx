import React from 'react'
import AddSchedule from '../components/schedule_components/AddSchedule'
import { Typography } from '@mui/material'
import ScheduleList from '../components/schedule_components/ScheduleList'

const Schedules = ({user, triggerRefresh,setTriggerRefresh}) => {
  return (
    <div>
   <div className='container-head'>
     <Typography
    component="h1"
    sx={{
      fontSize: {
        xs: '1.5rem', // Mobile
        sm: '2rem',   // Tablets
        md: '2.5rem', // Laptops
      },
      fontWeight: 600,
      color: '#505050',  // 👈 set color to black
      mt: 2,
      mb: 2
    }}
  >
    Therapy Schedules 
  </Typography>
   </div>
      <AddSchedule userId={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh}/>
      <ScheduleList userId={user} triggerRefresh={triggerRefresh} setTriggerRefresh={setTriggerRefresh}/>
    </div>
  )
}

export default Schedules