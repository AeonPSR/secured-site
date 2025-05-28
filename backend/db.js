const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'secure_juice.db'));

// Create table if it doesn't exist

//USERS
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

//PRODUCTS
db.prepare(`
	CREATE TABLE IF NOT EXISTS products (
	  id INTEGER PRIMARY KEY AUTOINCREMENT,
	  name TEXT NOT NULL,
	  description TEXT,
	  price REAL NOT NULL,
	  image_url TEXT,
	  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
  `).run();  

  //Demo if nothing exist
  const count = db.prepare('SELECT COUNT(*) AS total FROM products').get().total;
  if (count === 0) {
	db.prepare(`
	  INSERT INTO products (name, description, price, image_url)
	  VALUES (?, ?, ?, ?)
	`).run(
	  'Sample Juice',
	  'A refreshing demo drink.',
	  4.99,
	  'https://via.placeholder.com/150'
	);
  }


module.exports = db;
