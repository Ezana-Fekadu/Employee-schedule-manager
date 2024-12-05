class Schedule {
    constructor(db) {
        this.db = db;
    }

    async create(userId, date, shift) {
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO schedules (userId, date, shift) VALUES (?, ?, ?)`, [userId, date, shift], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);
            });
        });
    }

    async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT * FROM schedules WHERE userId = ?`, [userId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    }

    async update(id, date, shift) {
        return new Promise((resolve, reject) => {
            this.db.run(`UPDATE schedules SET date = ?, shift = ? WHERE id = ?`, [date, shift, id], function(err) {
                if (err ) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            this.db.run(`DELETE FROM schedules WHERE id = ?`, [id], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.changes);
            });
        });
    }
}

module.exports = Schedule;