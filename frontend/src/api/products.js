export async function getProducts() {
	const csrfRes = await fetch('http://localhost:3001/api/csrf-token', {
	  credentials: 'include'
	});
	const { csrfToken } = await csrfRes.json();
  
	const res = await fetch('http://localhost:3001/api/products', {
	  method: 'GET',
	  credentials: 'include',
	  headers: {
		'CSRF-Token': csrfToken
	  }
	});
	return res.json();
  }
  