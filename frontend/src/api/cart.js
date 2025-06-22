import { getCsrfToken } from './auth';

const API_URL = 'http://localhost:3001/api/cart';

export async function addToCart(productId) {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify({ product_id: productId, quantity: 1 })
  });
  return res.json();
}

export async function getCart() {
	const csrfToken = await getCsrfToken();
	const res = await fetch(`${API_URL}`, {
	  credentials: 'include',
	  headers: {
		'CSRF-Token': csrfToken
	  }
	});
	const data = await res.json();
	return data.cart;
}
  
export async function checkout() {
	const csrfToken = await getCsrfToken();
	const res = await fetch('http://localhost:3001/api/cart/checkout', {
	  method: 'POST',
	  headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
	  credentials: 'include',
	});
	return res.json();
}
  
export async function clearCart() {
	const csrfToken = await getCsrfToken();
	const res = await fetch('http://localhost:3001/api/cart/clear', {
	  method: 'DELETE',
	  headers: { 'Content-Type': 'application/json', 'CSRF-Token': csrfToken },
	  credentials: 'include',
	});
	return res.json();
}
  
