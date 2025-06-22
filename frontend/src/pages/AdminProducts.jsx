import { useEffect, useState } from 'react';
import { getMe } from '../api/auth';
import { getCsrfToken } from '../api/auth';

export default function AdminProductPanel() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);

  const loadProducts = async () => {
    const res = await fetch('http://localhost:3001/api/products', {
      credentials: 'include'
    });
    const data = await res.json();
    setProducts(data);
  };

  const handleInput = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    const csrfToken = await getCsrfToken();
    const url = editingId
      ? `http://localhost:3001/api/products/${editingId}`
      : 'http://localhost:3001/api/products';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'CSRF-Token': csrfToken
      },
      body: JSON.stringify(form)
    });

    setForm({ name: '', description: '', price: '', image_url: '' });
    setEditingId(null);
    loadProducts();
  };

  const deleteProduct = async (id) => {
    const csrfToken = await getCsrfToken();
    await fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'CSRF-Token': csrfToken }
    });
    loadProducts();
  };

  useEffect(() => {
	getMe().then(user => {
	  if (user?.role !== 'admin') {
		window.location.href = '/';
	  } else {
		loadProducts();
	  }
	});
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Product Management</h2>

      <input name="name" placeholder="Name" value={form.name} onChange={handleInput} />
      <input name="description" placeholder="Description" value={form.description} onChange={handleInput} />
      <input name="price" placeholder="Price" value={form.price} onChange={handleInput} />
      <input name="image_url" placeholder="Image URL" value={form.image_url} onChange={handleInput} />
      <button onClick={submitForm}>{editingId ? 'Update' : 'Create'} Product</button>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.price} €
            <button onClick={() => setForm(p) || setEditingId(p.id)}>Edit</button>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
