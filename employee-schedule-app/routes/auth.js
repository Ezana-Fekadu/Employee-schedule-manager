const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Change this in production

module.exports = (db) => {
    const userModel = new User(db);

    // User registration
    router.post('/register', async (req, res) => {
        const { username, password } = req.body;
        try {
            const existingUser  = await userModel.findByUsername(username);
            if (existingUser ) {
                return res.status(400).json({ message: 'User  already exists' });
            }
            const userId = await userModel.create(username, password);
            res.status(201).json({ message: 'User  registered successfully', userId });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error });
        }
    });

    // User login
    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await userModel.findByUsername(username);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error });
        }
    });

    return router;
};