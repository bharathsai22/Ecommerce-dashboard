const { db } = require('../config/db');

class User {
  static findByUsername(username, callback) {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], callback);
  }

  static create(username, password, callback) {
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, password],
      function(err) {
        callback(err, { id: this.lastID });
      }
    );
  }
}

module.exports = User;