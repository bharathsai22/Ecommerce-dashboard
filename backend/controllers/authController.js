const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const signup = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  User.findByUsername(username, (err, existingUser) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    User.create(username, hashedPassword, (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Error creating user' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: 86400 // 24 hours
      });

      res.status(201).json({ auth: true, token });
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ auth: false, token: null, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // 24 hours
    });

    res.status(200).json({ auth: true, token });
  });
};

module.exports = { signup, login };