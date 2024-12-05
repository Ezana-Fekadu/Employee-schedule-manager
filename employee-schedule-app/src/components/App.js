/* import React from 'react';
import BookingCalendar from './BookingCalendar';
import Schedule from "../schedule.js";

const App = () => {
    const events = [
        { start: '2024-12-05T10:00:00', end: '2024-12-05T12:00:00', pet_name: 'Buddy', human_name: 'Alice' },
        // Add more events as needed
    { start: '2024-12-06T09:00:00', end: '2024-12-06T11:00:00', pet_name: 'Max', human_name: 'Bob' },
        // Add more events as needed
    ];

    return (
        <div>
            <Schedule />
            <BookingCalendar events={events} />
        </div>
    );
}

export default App; */
import React, { useEffect, useState } from 'react';
import BookingCalendar from './BookingCalendar';
import Schedule from '../schedule.js';

const App = () => {
    const [events, setEvents] = useState([]);

    // Fetch schedules and transform them into calendar events
    const fetchSchedules = async () => {
        const response = await fetch('http://localhost:3000/schedules');
        const data = await response.json();
        const calendarEvents = data.map(schedule => ({
            start: new Date(schedule.start_time),
            end: new Date(schedule.end_time),
            title: `${schedule.employee}'s Shift`,
        }));
        setEvents(calendarEvents);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return (
        <div>
            {/* Display the Schedule Management Component */}
            <Schedule fetchSchedules={fetchSchedules} />

            {/* Pass dynamically fetched events to the BookingCalendar */}
            <BookingCalendar events={events} />
        </div>
    );
};

export default App;
