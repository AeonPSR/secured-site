const express = require('express');
const db = require('../db');
const requireLogin = require('../middlewares/auth');

const router = express.Router();

// POST /api/cart/add
router.post('/add', requireLogin, (req, res) => {
  const { product_id, quantity } = req.body;
  const userId = req.session.user.id;

  if (!product_id || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  try {
    const existing = db.prepare(`
      SELECT id FROM products WHERE id = ?
    `).get(product_id);
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const stmt = db.prepare(`
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
    `);
    stmt.run(userId, product_id, quantity);

    res.status(201).json({ message: 'Added to cart' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
});

// GET /api/cart
router.get('/', requireLogin, (req, res) => {
  const userId = req.session.user.id;

  try {
    const items = db.prepare(`
      SELECT c.id, c.quantity, p.name, p.price, p.image_url
      FROM cart_items c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `).all(userId);

    res.json({ cart: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch cart' });
  }
});

// DELETE /api/cart/:id
router.delete('/:id', requireLogin, (req, res) => {
  const userId = req.session.user.id;
  const itemId = req.params.id;

  try {
    const item = db.prepare('SELECT user_id FROM cart_items WHERE id = ?').get(itemId);

    if (!item || item.user_id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to remove item' });
  }
});

// POST /api/cart/checkout
router.post('/checkout', requireLogin, (req, res) => {
	const userId = req.session.user.id;
  
	try {
	  const cart = db.prepare(`
		SELECT c.quantity, p.name, p.price
		FROM cart_items c
		JOIN products p ON c.product_id = p.id
		WHERE c.user_id = ?
	  `).all(userId);
  
	  if (cart.length === 0) {
		return res.status(400).json({ message: 'Your cart is empty' });
	  }
  
	  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  
	  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId); //Clear cart for that user
  
	  res.json({
		message: '[Transaction+Bank logic starts after this]',
		total,
		items: cart
	  });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Checkout failed' });
	}
  });

  // DELETE /api/cart/clear
router.delete('/clear', requireLogin, (req, res) => {
	const userId = req.session.user.id;
  
	try {
	  db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
	  res.json({ message: 'Cart cleared' });
	} catch (err) {
	  console.error(err);
	  res.status(500).json({ message: 'Failed to clear cart' });
	}
});
  

module.exports = router;
