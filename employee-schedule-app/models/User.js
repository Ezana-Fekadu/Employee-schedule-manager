const bcrypt = require('bcryptjs');

class User {
    constructor(db) {
        this.db = db;
    }

    async create(username, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            this.db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
                if (err) {
                    return reject(err);
                }
                resolve(this.lastID);
            });
        });
    }

    async findByUsername(username) {
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row);
            });
        });
    }
}

module.exports = User;