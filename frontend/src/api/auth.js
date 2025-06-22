const API_URL = 'http://localhost:3001/api/auth';

export async function getCsrfToken() {
	const res = await fetch(`http://localhost:3001/api/csrf-token`, {
	  credentials: 'include'
	});
	const data = await res.json();
	return data.csrfToken;
}

export async function login(email, password) {
	const csrfToken = await getCsrfToken();
	const res = await fetch(`${API_URL}/login`, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'CSRF-Token': csrfToken
	  },
	  credentials: 'include',
	  body: JSON.stringify({ email, password })
	});
	return res.json();
}

export async function register(email, username, password) {
	const csrfToken = await getCsrfToken();
	const res = await fetch(`${API_URL}/register`, {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json',
		'CSRF-Token': csrfToken
	  },
	  credentials: 'include',
	  body: JSON.stringify({ email, username, password })
	});
	return res.json();
}

export async function getMe() {
	const csrfToken = await getCsrfToken();
	const res = await fetch('http://localhost:3001/api/auth/me', {
	  method: 'GET',
	  headers: {
		'CSRF-Token': csrfToken
	  },
	  credentials: 'include'
	});
	return res.json().then(data => data.user);
  }
  
export async function logout() {
	const csrfToken = await getCsrfToken();
	const res = await fetch(`${API_URL}/logout`, {
	  method: 'POST',
	  credentials: 'include',
	  headers: {
		'Content-Type': 'application/json',
		'CSRF-Token': csrfToken // THE TOKEN I HATE IT AAAAAA
	  }
	});
	return res.json();
  }

  
