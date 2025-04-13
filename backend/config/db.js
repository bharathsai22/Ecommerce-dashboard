const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, '../../revisit.db');

let db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

const initializeDatabase = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      itemCount INTEGER NOT NULL DEFAULT 0,
      imageUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default admin user if not exists
    const defaultUsername = 'admin';
    const defaultPassword = 'admin123';
    
    db.get(`SELECT id FROM users WHERE username = ?`, [defaultUsername], (err, row) => {
      if (!row) {
        const hashedPassword = bcrypt.hashSync(defaultPassword, 8);
        db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [defaultUsername, hashedPassword]);
        console.log('Default admin user created');
      }
    });

    // Insert sample categories if none exist
    db.get(`SELECT COUNT(*) as count FROM categories`, (err, row) => {
      if (row.count === 0) {
        const sampleCategories = [
          { name: 'Man Clothes', itemCount: 24 },
          { name: 'Women Clothes', itemCount: 12 },
          { name: 'Accessories', itemCount: 43 },
          { name: 'Custom Clothes', itemCount: 31 },
          { name: 'Summer Clothes', itemCount: 26 },
          { name: 'Wedding Clothes', itemCount: 52 },
          { name: 'Spring Collection', itemCount: 24 },
          { name: 'Casual Clothes', itemCount: 92 },
          { name: 'Hats', itemCount: 26 }
        ];

        const stmt = db.prepare(`INSERT INTO categories (name, itemCount) VALUES (?, ?)`);
        sampleCategories.forEach(category => {
          stmt.run(category.name, category.itemCount);
        });
        stmt.finalize();
        console.log('Sample categories inserted');
      }
    });
  });
};

module.exports = { db, initializeDatabase };