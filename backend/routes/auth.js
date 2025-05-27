const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already used' });
    }

    const hash = await bcrypt.hash(password, 12);
    const stmt = db.prepare('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)');
    const result = stmt.run(email, username, hash);

    req.session.user = { id: result.lastInsertRowid, email, username };
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
