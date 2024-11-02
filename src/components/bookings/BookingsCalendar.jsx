import React, { useEffect, useState } from 'react'
// schedule
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createCalendar, createViewMonthAgenda, createViewMonthGrid, viewDay } from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createEventModalPlugin } from '@schedule-x/event-modal'
import '@schedule-x/theme-default/dist/index.css'
import CustomEventModal from './CustomEventModal'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'

export default function BookingsCalendar({ events }) {

  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [loading, setLoading ] = useState(true)

  const plugins = [
    createEventModalPlugin(),
    createEventsServicePlugin(),
    createDragAndDropPlugin(),
  ]

  const calendars = {
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
  
  const calendar = useCalendarApp({
    views: [createViewMonthGrid(), createViewMonthAgenda()],
    events: events.length > 0 ? events : [],
    calendars: calendars,
    config: {
      callbacks: {
        onEventClick(calendarEvent) {
          setShowModal(false);
          setSelectedEvent(calendarEvent);
          setShowModal(true);
        },
      },
    },
  }, plugins);

  useEffect(() => {
    // get all events
    if(events.length > 0){
      calendar.eventsService.set(events)
      setLoading(false)
    }
  },[events, calendar])   

  
  return (

    <>
    {/** <div>      
      <ScheduleXCalendar calendarApp={calendar} customComponents={CustomEventModal} />
    </div> */}
    {
      loading ? 
      (<div>Loading...</div>) :
      (
        <div>
          <ScheduleXCalendar calendarApp={calendar} customComponents={ {eventModal: CustomEventModal}} />
        </div>
      )
    }
            {/* Only show Calendar if bookings data is available */}
            
          
    </>
    

  )
}

