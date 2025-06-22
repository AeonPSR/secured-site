import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMe, logout, getCsrfToken } from '../api/auth';

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe()
      .then(data => {
        if (!data.message) setUser(data);
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await getCsrfToken(); // Session
    await logout();
    setUser(null);
  };

  return (
    <header style={{ padding: '1rem', background: '#878787' }}>
      <nav style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        <Link to="/products">Products</Link>
        {user?.role === 'admin' && <Link to="/admin/products">Admin Products</Link>}
        {user?.role === 'admin' && <Link to="/admin/users">Admin Users</Link>}
        {user && <span>Logged in as: {user.email}</span>}
        {user && <button onClick={handleLogout}>Logout</button>}
      </nav>
    </header>
  );
}
