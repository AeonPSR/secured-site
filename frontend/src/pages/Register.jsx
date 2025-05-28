import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await register(email, username, password);
    if (res.message === 'Registered successfully') {
      navigate('/login');
    } else {
      setError(res.message || 'Registration failed');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /><br />
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
