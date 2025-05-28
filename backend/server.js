const express = require('express');
const session = require('express-session');
const csrf = require('csurf');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(helmet());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'strict' }
}));

if (process.env.NODE_ENV !== 'development') {
  app.use(csrf());
}

app.get('/', (req, res) => {
  res.send('Secure Juice API is running.');
});

//Stuff so the routes are actually usable by the server
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);


app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});