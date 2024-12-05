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

export default Schedule;