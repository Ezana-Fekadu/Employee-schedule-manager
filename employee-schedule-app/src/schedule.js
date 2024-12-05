/* import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        const response = await axios.get("http://localhost:4000/schedules");
        setSchedules(response.data);
    };

    const handleDateChange = (date) => {
        setDate(date);
    };

    return (
        <div>
            <h1>Employee Schedule Management</h1>
            <Calendar onChange={handleDateChange} value={date} />
            <ul>
                {schedules.map(schedule => (
                    <li key={schedule.id}>{schedule.employee}: {schedule.start_time} - {schedule.end_time}</li>
                ))}
            </ul>
        </div>
    );
};

export default Schedule; */
/* 
// src/Schedule.js
import React, { useEffect, useState } from 'react';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [employee, setEmployee] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchSchedules = async () => {
        const response = await fetch('http://localhost:4000/schedules');
        const data = await response.json();
        setSchedules(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            // Update existing schedule
            const response = await fetch ('http://localhost:4000/schedules/' + editingId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
            if (response.ok) {
                fetchSchedules();
                resetForm();
            }
        } else {
            // Create new schedule
            const response = await fetch('http://localhost:4000/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
            if (response.ok) {
                fetchSchedules();
                resetForm();
            }
        }
    };

    const handleEdit = (schedule) => {
        setEmployee(schedule.employee);
        setStartTime(schedule.start_time);
        setEndTime(schedule.end_time);
        setEditingId(schedule.id);
    };

    const handleDelete = async (id) => {
        const response = await fetch('http://localhost:4000/schedules/' + id, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchSchedules();
        }
    };

    const resetForm = () => {
        setEmployee('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    return (
        <div>
            <h1>Employee Schedules</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? 'Update Schedule' : 'Add Schedule'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
            <ul>
                {schedules.map((schedule) => (
                    <li key={schedule.id}>
                        {schedule.employee} - {schedule.start_time} to {schedule.end_time}
                        <button onClick={() => handleEdit(schedule)}>Edit</button>
                        <button onClick={() => handleDelete(schedule.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Schedule; */

///////////////////////////////////////

/* const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            // Update existing schedule
            await fetch(`http://localhost:3000/schedules/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
        } else {
            // Create new schedule
            await fetch('http://localhost:3000/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
        }

        // Refresh schedules for both the list and the calendar
        fetchSchedules();
        resetForm();
    }; */
    ///////////////////////////////////////

/* import React, { useEffect, useState } from 'react';

////////////////////////////////
const fetchSchedules = async () => {
    try {
        const response = await fetch('http://localhost:4000/schedules');
        if (!response.ok) throw new Error('Failed to fetch schedules');
        const data = await response.json();
        setSchedules(data);
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
};

//////////////////////////////////

const Schedule = ({ fetchSchedules }) => {
    const [schedules, setSchedules] = useState([]);
    const [employee, setEmployee] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [editingId, setEditingId] = useState(null);

    

    ///////////////////////////////////////////////////
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = editingId
                ? `http://localhost:4000/schedules/${editingId}`
                : 'http://localhost:4000/schedules';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
            if (!response.ok) throw new Error('Failed to save schedule');
            fetchSchedules();
            resetForm();
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    ////////////////////////////////////////////////////////

    const handleDelete = async (id) => {
        await fetch(`http://localhost:3000/schedules/${id}`, { method: 'DELETE' });
        fetchSchedules();
    };

    const resetForm = () => {
        setEmployee('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);
    };

    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    return (
        <div>
            <h1>Employee Schedules</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? 'Update Schedule' : 'Add Schedule'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
        </div>
    );
};

export default Schedule;
 */

/* 
import React, { useEffect, useState } from 'react';

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [employee, setEmployee] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [editingId, setEditingId] = useState(null);

    // Fetch schedules
    const fetchSchedules = async () => {
        try {
            const response = await fetch('http://localhost:4000/schedules');
            if (!response.ok) throw new Error('Failed to fetch schedules');
            const data = await response.json();
            setSchedules(data); // Now `setSchedules` is accessible
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = editingId
                ? `http://localhost:4000/schedules/${editingId}`
                : 'http://localhost:4000/schedules';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
            if (!response.ok) throw new Error('Failed to save schedule');
            fetchSchedules();
            resetForm();
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:4000/schedules/${id}`, { method: 'DELETE' });
            fetchSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const resetForm = () => {
        setEmployee('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);
    };

    useEffect(() => {
        fetchSchedules();
    }, []); // Remove `fetchSchedules` dependency to avoid issues

    return (
        <div>
            <h1>Employee Schedules</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? 'Update Schedule' : 'Add Schedule'}</button>
                <button type="button" onClick={resetForm}>Cancel</button>
            </form>
            <ul>
                {schedules.map(schedule => (
                    <li key={schedule.id}>
                        {schedule.employee} - {schedule.start_time} to {schedule.end_time}
                        <button onClick={() => {
                            setEditingId(schedule.id);
                            setEmployee(schedule.employee);
                            setStartTime(schedule.start_time);
                            setEndTime(schedule.end_time);
                        }}>
                            Edit
                        </button>
                        <button onClick={() => handleDelete(schedule.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Schedule; */

/////////////////////////////////////////////////////////////////////////
//now add the calendar view
////////////////////////////////////////////////////////////////////////
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { formatISO } from 'date-fns';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const Schedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [employee, setEmployee] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [editingId, setEditingId] = useState(null);

    const fetchSchedules = async () => {
        try {
            const response = await fetch('http://localhost:4000/schedules');
            if (!response.ok) throw new Error('Failed to fetch schedules');
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = editingId
                ? `http://localhost:4000/schedules/${editingId}`
                : 'http://localhost:4000/schedules';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employee, start_time: startTime, end_time: endTime }),
            });
            if (!response.ok) throw new Error('Failed to save schedule');
            fetchSchedules();
            resetForm();
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    const handleDelete = async () => {
        if (!editingId) return;
        try {
            await fetch(`http://localhost:4000/schedules/${editingId}`, { method: 'DELETE' });
            fetchSchedules();
            resetForm();
        } catch (error) {
            console.error('Error deleting schedule:', error);
        }
    };

    const resetForm = () => {
        setEmployee('');
        setStartTime('');
        setEndTime('');
        setEditingId(null);
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const events = schedules.map(schedule => ({
        title: `${schedule.employee}: ${schedule.start_time} - ${schedule.end_time}`,
        start: new Date(schedule.start_time),
        end: new Date(schedule.end_time),
        id: schedule.id,
    }));

    return (
        <div>
            <h1>Employee Schedules</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Employee Name"
                    value={employee}
                    onChange={(e) => setEmployee(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? 'Update Schedule' : 'Add Schedule'}</button>
                {editingId && (
                    <button
                        type="button"
                        onClick={handleDelete}
                        style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                    >
                        Delete Schedule
                    </button>
                )}
                <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>
                    Cancel
                </button>
            </form>

            <h2>Calendar View</h2>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: '20px' }}
                onSelectEvent={(event) => {
                    const selectedSchedule = schedules.find(schedule => schedule.id === event.id);
                    if (selectedSchedule) {
                        setEditingId(selectedSchedule.id);
                        setEmployee(selectedSchedule.employee);
                        setStartTime(formatISO(new Date(selectedSchedule.start_time)));
                        setEndTime(formatISO(new Date(selectedSchedule.end_time)));
                    }
                }}
            />
        </div>
    );
};

export default Schedule;
