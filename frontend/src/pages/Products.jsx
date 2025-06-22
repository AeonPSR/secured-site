import { useEffect, useState } from 'react';
import { addToCart, getCart, checkout, clearCart } from '../api/cart';
import { getMe } from '../api/auth';

export default function Products() {
const [products, setProducts] = useState([]);
const [cart, setCart] = useState([]);
const [user, setUser] = useState(null);
const [message, setMessage] = useState('');

useEffect(() => {
	fetch('http://localhost:3001/api/products')
	.then(res => res.json())
	.then(data => setProducts(data));

	checkLogin();
}, []);

const checkLogin = async () => {
	try {
	const me = await getMe();
	if (!me.message) {
		setUser(me);
		loadCart();
	}
	} catch {
	setUser(null);
	}
};

const loadCart = async () => {
	try {
	const items = await getCart();
	setCart(items);
	} catch {
	setCart([]);
	}
};

const handleAdd = async (id) => {
	const res = await addToCart(id);
	setMessage(res.message || 'Added!');
	await loadCart();
};

return (
	<div style={{ padding: '2rem' }}>
	<h2>Products</h2>
	{products.map(p => (
		<div key={p.id}>
		<strong>{p.name}</strong> - {p.price} €
		{user && <button onClick={() => handleAdd(p.id)}>Add to cart</button>}
		</div>
	))}
	<p>{message}</p>

	{user && cart.length > 0 && (
		<>
		<h3>Cart</h3>
		{cart.map(item => (
			<div key={item.id}>
			{item.name} x {item.quantity} — {item.price * item.quantity} €
			</div>
		))}

		<button onClick={async () => {
			const res = await checkout();
			alert(res.message || 'Purchase complete!');
			loadCart();
		}}>
			Checkout
		</button>

		<button onClick={async () => {
			alert("CROS doesn't like fun so we can't use that locally since it uses a DELETE call. No idea why it doesn't work here but the DELETE call on the Admin side works fine. Don't have time to fix it.");
			const res = await clearCart();
			alert(res.message || 'Cart cleared!');
			loadCart();
		}}>
			Clear Cart
		</button>
		</>
	)}
	</div>
);
}
