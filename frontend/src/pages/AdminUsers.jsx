// src/pages/AdminUsers.jsx
import { useEffect, useState } from 'react';
import { getMe } from '../api/auth';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMe().then(user => {
      if (user?.role !== 'admin') {
        window.location.href = '/';
      } else {
        loadUsers();
      }
    });
  }, []);

  const loadUsers = async () => {
    const csrfToken = await fetch('http://localhost:3001/api/csrf-token', {
      credentials: 'include',
    }).then(res => res.json()).then(data => data.csrfToken);

    const res = await fetch('http://localhost:3001/api/users', {
      headers: { 'CSRF-Token': csrfToken },
      credentials: 'include',
    });
    const data = await res.json();
    setUsers(data.users || []);
  };

  const handleDelete = async (id) => {
    const csrfToken = await fetch('http://localhost:3001/api/csrf-token', {
      credentials: 'include',
    }).then(res => res.json()).then(data => data.csrfToken);

    const res = await fetch(`http://localhost:3001/api/users/${id}`, {
      method: 'DELETE',
      headers: { 'CSRF-Token': csrfToken },
      credentials: 'include',
    });

    const data = await res.json();
    setMessage(data.message || 'User deleted');
    loadUsers();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin – User Management</h2>
      {users.map(u => (
        <div key={u.id}>
          {u.email} ({u.username}) — Role: {u.role}
          <button onClick={() => handleDelete(u.id)}>Delete</button>
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
}
