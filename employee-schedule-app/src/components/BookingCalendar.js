/* import React, { Component } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class BookingCalendar extends Component {
    setDates = () => {
        const events = this.props.events.map(event => ({
            start: new Date(event.start),
            end: new Date(event.end),
            title: `${event.pet_name} Stay (Human: ${event.human_name})`,
            allDay: true
        }));
        return events;
    }

    render() {
        return (
            <div className="calendar-container">
                <BigCalendar
                    localizer={localizer}
                    events={this.setDates()}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "50px" }}
                />
            </div>
        );
    }
}

export default BookingCalendar; */

import React, { Component } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

class BookingCalendar extends Component {
    setDates = () => {
        return this.props.events.map(event => ({
            start: new Date(event.start),
            end: new Date(event.end),
            title: event.title,
        }));
    };

    render() {
        return (
            <div className="calendar-container">
                <BigCalendar
                    localizer={localizer}
                    events={this.setDates()}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, margin: "50px" }}
                />
            </div>
        );
    }
}

export default BookingCalendar;
