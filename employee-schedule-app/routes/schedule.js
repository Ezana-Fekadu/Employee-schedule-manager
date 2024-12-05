const express = require('express');
const Schedule = require('../models/Schedule');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
    const scheduleModel = new Schedule(db);
    const router = express.Router();

    // Middleware to authenticate JWT
    const authenticateJWT = (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.sendStatus(403);
        }
        jwt.verify(token, 'your_jwt_secret', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    };

    // Create a new schedule
    router.post('/', authenticateJWT, async (req, res) => {
        const { date, shift } = req.body;
        try {
            const scheduleId = await scheduleModel.create(req.user.id, date, shift);
            res.status(201).json({ message: 'Schedule created successfully', scheduleId });
        } catch (error) {
            res.status(500).json({ message: 'Error creating schedule', error });
        }
    });

    // Get schedules for the logged-in user
    router.get('/', authenticateJWT, async (req, res) => {
        try {
            const schedules = await scheduleModel.findByUserId(req.user.id);
            res.json(schedules);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching schedules', error });
        }
    });

    // Update a schedule
    router.put('/:id', authenticateJWT, async (req, res) => {
        const { date, shift } = req.body;
        try {
            const changes = await scheduleModel.update(req.params.id, date, shift);
            if (changes === 0) {
                return res.status(404).json({ message: 'Schedule not found' });
            }
            res.json({ message: 'Schedule updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating schedule', error });
        }
    });

    // Delete a schedule
    router.delete('/:id', authenticateJWT, async (req, res) => {
        try {
            const changes = await scheduleModel.delete(req.params.id);
            if (changes === 0) {
                return res.status(404).json({ message: 'Schedule not found' });
            }
            res.json({ message: 'Schedule deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting schedule', error });
        }
    });

    return router;
};