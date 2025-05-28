const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const router = express.Router();
const requireLogin = require('../middlewares/auth');

router.post('/register', async (req, res) => { //REGISTER
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

router.post('/login', async (req, res) => { //LOGIN
	const { email, password } = req.body;
	if (!email || !password) {
	return res.status(400).json({ message: 'Missing email or password' });
	}

	try {
	const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
	if (!user) {
		return res.status(401).json({ message: 'Invalid email or password' });
	}

	const match = await bcrypt.compare(password, user.password_hash);
	if (!match) {
		return res.status(401).json({ message: 'Invalid email or password' });
	}

	req.session.user = {
		id: user.id,
		email: user.email,
		username: user.username,
		role: user.role
	};

	res.status(200).json({ message: 'Logged in successfully' });
	} catch (err) {
	console.error(err);
	res.status(500).json({ message: 'Server error' });
	}
});

router.post('/logout', requireLogin, (req, res) => { //LOGOUT
	req.session.destroy(err => {
	if (err) {
		console.error(err);
		return res.status(500).json({ message: 'Logout failed' });
	}
	res.clearCookie('connect.sid');
	res.status(200).json({ message: 'Logged out successfully' });
	});
});

router.get('/me', requireLogin, (req, res) => { //Print name (Debug)
	res.json({ user: req.session.user });
});



module.exports = router;
