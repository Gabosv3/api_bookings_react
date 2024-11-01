import React, { useEffect, useState } from 'react'
// schedule
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewMonthAgenda, createViewMonthGrid } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import { createCurrentTimePlugin } from '@schedule-x/current-time'
import '@schedule-x/theme-default/dist/index.css'

export default function BookingsCalendar({ events }) {

  const plugins = [
    createEventsServicePlugin(),
    createEventModalPlugin(),
    createCurrentTimePlugin(),
  ]
  const [loading, setLoading ] = useState(true)

  const calendar = useCalendarApp({
    
    views: [createViewMonthGrid(), createViewMonthAgenda()],
    events: events.length > 0 ? events : [],
    calendars: {
      CONFIRMED: {
        colorName: 'CONFIRMED',
        lightColors: {
          main: '#1c7df9',
          container: '#d2e7ff',
          onContainer: '#002859',
        },
        darkColors: {
          main: '#c0dfff',
          onContainer: '#dee6ff',
          container: '#426aa2',
        },
      },
      PENDING: {
        colorName: 'PENDING',
        lightColors: {
          main: '#ffe380',
          container: '#fff3c9',
          onContainer: '#ebb802',
        },
        darkColors: {
          main: '#fff6c0',
          onContainer: '#fffdde',
          container: '#a29f42',
        },
      },
      CANCELLED: {
        colorName: 'CANCELLED',
        lightColors: {
          main: '#f91c36',
          container: '#ffd2d2',
          onContainer: '#590000',
        },
        darkColors: {
          main: '#f70a0a',
          onContainer: '#dee6ff',
          container: '#426aa2',
        },
      },
      
    }
  }, plugins)  
 
  useEffect(() => {
    // get all events
    if(events.length > 0){
      calendar.eventsService.getAll()
      setLoading(false)
    } else {
      setLoading(true)
    }
  },[events, calendar])   

  return (
    <div>      
      {/* Only show Calendar if bookings data is available */}
      { console.log("antes de renderizar",events, loading) }
      
      { events.length > 0 && !loading ? (<ScheduleXCalendar calendarApp={calendar} /> ) : (<p>Cargando calendario desde componente</p>)}
           
    </div>
  )
}

