/* const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(':memory:'); // Use ':memory:' for in-memory database or specify a file path

db.serialize(() => {
    db.run("CREATE TABLE schedules (id INTEGER PRIMARY KEY, employee TEXT, start_time TEXT, end_time TEXT)");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//api endpoints

app.post("/schedules", (req, res) => {
    const { employee, start_time, end_time } = req.body;
    db.run("INSERT INTO schedules (employee, start_time, end_time) VALUES (?, ?, ?)", [employee, start_time, end_time], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

app.get("/schedules", (req, res) => {
    db.all("SELECT * FROM schedules", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
}); */
/* 
// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

//api endpoints

// Create a new schedule
app.post('/schedules', (req, res) => {
    const { employee, start_time, end_time } = req.body;
    db.run('INSERT INTO schedules (employee, start_time, end_time) VALUES (?, ?, ?)', [employee, start_time, end_time], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, employee, start_time, end_time });
    });
});

// Read all schedules
app.get('/schedules', (req, res) => {
    db.all('SELECT * FROM schedules', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Read a single schedule by ID
app.get('/schedules/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM schedules WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json(row);
    });
});

// Update a schedule
app.put('/schedules/:id', (req, res) => {
    const { id } = req.params;
    const { employee, start_time, end_time } = req.body;
    db.run('UPDATE schedules SET employee = ?, start_time = ?, end_time = ? WHERE id = ?', [employee, start_time, end_time, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json({ id, employee, start_time, end_time });
    });
});

// Delete a schedule
app.delete('/schedules/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM schedules WHERE id = ?', [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:4000`);
}); *//* 
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const authRoutes = require('../routes/auth'); // Ensure this path is correct
const scheduleRoutes = require('../routes/schedule');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create tables if they don't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER,
            date TEXT,
            shift TEXT,
            FOREIGN KEY (userId) REFERENCES users (id)
        )`);
    }
});

// Use the routes
app.use('/api/auth', authRoutes(db));
app.use('/api/schedule', scheduleRoutes(db));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); */


const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// SQLite Database
const db = new sqlite3.Database('./schedules.db', (err) => {
    if (err) console.error('Error opening database:', err.message);
    else console.log('Connected to SQLite database.');
});

// Create schedules table if not exists
db.run(`
    CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL
    )
`);

// GET all schedules
app.get('/schedules', (req, res) => {
    db.all('SELECT * FROM schedules', [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// POST a new schedule
app.post('/schedules', (req, res) => {
    const { employee, start_time, end_time } = req.body;
    db.run('INSERT INTO schedules (employee, start_time, end_time) VALUES (?, ?, ?)',
        [employee, start_time, end_time],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

// PUT (update) an existing schedule
app.put('/schedules/:id', (req, res) => {
    const { id } = req.params;
    const { employee, start_time, end_time } = req.body;
    db.run('UPDATE schedules SET employee = ?, start_time = ?, end_time = ? WHERE id = ?',
        [employee, start_time, end_time, id],
        (err) => {
            if (err) res.status(500).json({ error: err.message });
            else res.sendStatus(200);
        }
    );
});

// DELETE a schedule
app.delete('/schedules/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM schedules WHERE id = ?', [id], (err) => {
        if (err) res.status(500).json({ error: err.message });
        else res.sendStatus(200);
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
