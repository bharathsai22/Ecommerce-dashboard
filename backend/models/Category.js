const { db } = require('../config/db');

class Category {
  static getAll(callback) {
    db.all(`SELECT * FROM categories ORDER BY name`, callback);
  }

  static getById(id, callback) {
    db.get(`SELECT * FROM categories WHERE id = ?`, [id], callback);
  }

  static create(name, itemCount, imageUrl, callback) {
    db.run(
      `INSERT INTO categories (name, itemCount, imageUrl) VALUES (?, ?, ?)`,
      [name, itemCount || 0, imageUrl || null],
      function(err) {
        callback(err, { id: this.lastID });
      }
    );
  }

  static update(id, name, itemCount, imageUrl, callback) {
    db.run(
      `UPDATE categories SET name = ?, itemCount = ?, imageUrl = ? WHERE id = ?`,
      [name, itemCount, imageUrl, id],
      callback
    );
  }

  static delete(id, callback) {
    db.run(`DELETE FROM categories WHERE id = ?`, [id], callback);
  }
}

module.exports = Category;