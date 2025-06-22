import { useState } from 'react';
import { getCsrfToken, login } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    await getCsrfToken(); // Sets cookie + get session token-thing

    const data = await login(email, password); // Adds the CSRF-Token header (I think ?)
    setMessage(data.message || 'Logged in!');
	window.location.reload();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
