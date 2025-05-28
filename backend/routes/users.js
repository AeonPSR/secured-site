const express = require('express');
const db = require('../db');
const requireLogin = require('../middlewares/auth');
const requireAdmin = require('../middlewares/admin');
const router = express.Router();

// GET /api/users/me
router.get('/me', requireLogin, (req, res) => {
  const user = db.prepare('SELECT id, email, username, role, created_at FROM users WHERE id = ?').get(req.session.user.id);
  res.json({ user });
});

// PUT  /api/users/me (Edit profile)
router.put('/me', requireLogin, (req, res) => {
	const { username } = req.body;
	if (!username) {
	  return res.status(400).json({ message: 'Username is required' });
	}
  
	try {
	  const stmt = db.prepare('UPDATE users SET username = ? WHERE id = ?');
	  const result = stmt.run(username, req.session.user.id);
  
	  // Update session to reflect new username
	  req.session.user.username = username;
  
	  res.json({ updated: result.changes });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Could not update profile' });
	}
});
  
// GET /api/users (Get all users)
router.get('/', requireLogin, requireAdmin, (req, res) => {
	try {
	  const users = db.prepare(`
		SELECT id, email, username, role, created_at
		FROM users
	  `).all();
  
	  res.json({ users });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Could not fetch users' });
	}
});
  
// DELETE /api/users 
router.delete('/:id', requireLogin, requireAdmin, (req, res) => {
	const userId = parseInt(req.params.id);
  
	if (userId === req.session.user.id) {
	  return res.status(403).json({ message: "You can't delete yourself" });
	}
  
	try {
	  const result = db.prepare('DELETE FROM users WHERE id = ?').run(userId);
	  if (result.changes === 0) {
		return res.status(404).json({ message: 'User not found' });
	  }
  
	  res.json({ deleted: result.changes });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Could not delete user' });
	}
  });

module.exports = router;
