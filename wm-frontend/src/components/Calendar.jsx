  import React, { useState, useEffect } from 'react';
  import FullCalendar from '@fullcalendar/react';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import axios from '../axios-config.js';
  import '../styles/Calendar.css';

  const Calendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
      fetchEvents();
    }, []);

    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/calendar/events');
        console.log('API response:', response.data);
        const formattedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          allDay: event.allDay
        }));
        console.log('Formatted events:', formattedEvents);
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    const handleDateClick = (arg) => {
      console.log(arg.dateStr);
    };

    const handleEventClick = (info) => {
      console.log(info.event.title);
    };

    return (
      <div className='calendar-parent' style={{ height: 'calc(100vh - 112px)', width: '100%' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={new Date()}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="100%"
        />
      </div>
    );
  };

  export default Calendar;