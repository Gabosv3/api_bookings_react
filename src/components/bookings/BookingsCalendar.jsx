import React, { useEffect } from 'react'
// schedule
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewDay, createViewMonthAgenda, createViewMonthGrid,createViewWeek } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import '@schedule-x/theme-default/dist/index.css'

export default function BookingsCalendar() {

  const plugins = [createEventsServicePlugin()]
 
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2023-12-16',
        end: '2023-12-16',
      },  
    ],  
  }, plugins)  
 
  useEffect(() => {
    // get all events
    calendar.eventsService.getAll()
  },[])   

  return (
    <div>      
      <ScheduleXCalendar calendarApp={calendar} />      
    </div>
  )
}
