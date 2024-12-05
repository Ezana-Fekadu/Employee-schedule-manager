// tests/schedules.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../database'); // Adjust the path as necessary
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Import your routes here
app.post('/schedules', (req, res) => {
    const { employee, start_time, end_time } = req.body;
    db.run('INSERT INTO schedules (employee, start_time, end_time) VALUES (?, ?, ?)', [employee, start_time, end_time], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, employee, start_time, end_time });
    });
});

app.get('/schedules', (req, res) => {
    db.all('SELECT * FROM schedules', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

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

// Tests
describe('Schedules API', () => {
    beforeAll((done) => {
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS schedules (id INTEGER PRIMARY KEY AUTOINCREMENT, employee TEXT NOT NULL, start_time TEXT NOT NULL, end_time TEXT NOT NULL)', done);
        });
    });

    afterAll((done) => {
        db.serialize(() => {
            db.run('DROP TABLE schedules', done);
        });
    });

    it('should create a new schedule', async () => {
        const response = await request(app)
            .post('/schedules')
            .send({ employee: 'John Doe', start_time: '2023-10-01T09:00:00', end_time: '2023-10-01T17:00:00' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.employee).toBe('John Doe');
        expect(response.body.start_time).toBe('2023-10-01T09:00:00');
        expect(response.body.end_time).toBe('2023-10-01T17:00:00');
    });

    it('should read all schedules', async () => {
        const response = await request(app).get('/schedules');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should read a single schedule by ID', async () => {
        const newSchedule = await request(app)
            .post('/schedules')
            .send({ employee: 'Jane Doe', start_time: '2023-10-02T09:00:00', end_time: '2023-10-02T17:00:00' });
        const response = await request(app).get(`/schedules/${newSchedule.body.id}`);
        expect(response.status).toBe(200);
        expect(response.body.employee).toBe('Jane Doe');
    });

    it('should update a schedule', async () => {
        const newSchedule = await request(app)
            .post('/schedules')
            .send({ employee: 'Mark Smith', start_time: '2023-10-03T09:00:00', end_time: '2023-10-03T17:00:00' });
        const response = await request(app)
            .put(`/schedules/${newSchedule.body.id}`)
            .send({ employee: 'Mark Smith', start_time: '2023-10-03T10:00:00', end_time: '2023-10-03T18:00:00' });
        expect(response.status).toBe(200);
        expect(response.body.start_time).toBe('2023-10-03T10:00:00');
    });

    it('should delete a schedule', async () => {
        const newSchedule = await request(app)
            .post('/schedules')
            .send({ employee: 'Alice Johnson', start_time: '2023-10-04T09:00:00', end_time: '2023-10-04T17:00:00' });
        const response = await request(app).delete(`/schedules/${newSchedule.body.id}`);
        expect(response.status).toBe(204);
    });

    it('should return 404 for a non-existent schedule', async () => {
        const response = await request(app).get('/schedules/999');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Schedule not found');
    });
});