const express = require('express');
const db = require('../db');
const router = express.Router();
const requireLogin = require('../middlewares/auth');
const requireAdmin = require('../middlewares/admin');

// GET /api/products → list all
router.get('/', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products').all();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch products' });
  }
});

// GET /api/products/:id → single product
router.get('/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch product' });
  }
});

// POST /api/products → create product
router.post('/', requireLogin, requireAdmin, (req, res) => {
	const { name, description, price, image_url } = req.body;
	if (!name || !price) {
	  return res.status(400).json({ message: 'Missing required fields' });
	}
  
	try {
	  const stmt = db.prepare(`
		INSERT INTO products (name, description, price, image_url)
		VALUES (?, ?, ?, ?)
	  `);
	  const result = stmt.run(name, description, price, image_url);
	  res.status(201).json({ id: result.lastInsertRowid });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Failed to create product' });
	}
  });
  
  // PUT /api/products/:id → update
  router.put('/:id', requireLogin, requireAdmin, (req, res) => {
	const { name, description, price, image_url } = req.body;
	try {
	  const stmt = db.prepare(`
		UPDATE products SET name = ?, description = ?, price = ?, image_url = ?
		WHERE id = ?
	  `);
	  const result = stmt.run(name, description, price, image_url, req.params.id);
	  res.json({ updated: result.changes });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Failed to update product' });
	}
  });
  
  // DELETE /api/products/:id → delete
  router.delete('/:id', requireLogin, requireAdmin, (req, res) => {
	try {
	  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
	  const result = stmt.run(req.params.id);
	  res.json({ deleted: result.changes });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Failed to delete product' });
	}
  });






module.exports = router;
