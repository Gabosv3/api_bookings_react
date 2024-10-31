import React, { useEffect, useState } from 'react'
// schedule
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay, createViewMonthAgenda, createViewMonthGrid,createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'

export default function BookingsCalendar({ events }) {

  const plugins = [createEventsServicePlugin()]
  const [loading, setLoading ] = useState(true)

  

  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: events,
  }, plugins)  
 
  useEffect(() => {
    // get all events
    calendar.eventsService.getAll()
  },[])   

  return (
    <div>      
      {/* Only show Calendar if bookings data is available */}
      { console.log("antes de renderizar",events) }
      
      { events.length > 0 && <ScheduleXCalendar calendarApp={calendar} /> }
           
    </div>
  )
}

