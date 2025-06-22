const express = require('express');
const session = require('express-session');
const csrf = require('csurf'); //session
const helmet = require('helmet'); //Set HTTP headers
const dotenv = require('dotenv'); //To use .env
const rateLimit = require('express-rate-limit');
const cors = require('cors'); //Restrict which websites can access the API.

dotenv.config();
const app = express();


const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 200,                 // Requests per windowMs
	message: { message: 'Too many requests, slow down.' }
});


app.use(cors({
	origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'CSRF-Token']
}));

app.use(helmet());
app.use(express.json());
app.use(session({
	secret: process.env.SESSION_SECRET || 'dev-secret',
	resave: false,
	saveUninitialized: false,
	cookie: {
	  httpOnly: true,
	  sameSite: 'lax',   
	  secure: false      // keep false in local dev (no HTTPS)
	}
  }));

app.use(limiter); //Calling the limiter so it will be used for ALL routes
  

app.use(csrf()); //Cors 


app.get('/api/csrf-token', (req, res) => { //CSRF TOKEN thing ?? -> It's to make a token used by a session, necessary for other routes
	res.json({ csrfToken: req.csrfToken() });
});

app.get('/', (req, res) => {
  res.send('Secure Juice API is running.');
});

//Stuff so the routes are actually usable by the server
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const cartRoutes = require('./routes/cart');
app.use('/api/cart', cartRoutes);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});