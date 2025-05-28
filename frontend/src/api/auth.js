const API_URL = 'http://localhost:3001/api/auth';

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // crucial for session cookies
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(email, username, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, username, password })
  });
  return res.json();
}

export async function getMe() {
  const res = await fetch(`${API_URL}/me`, {
    credentials: 'include'
  });
  return res.json();
}

export async function logout() {
  const res = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include'
  });
  return res.json();
}
