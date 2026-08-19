import { useState, useEffect } from 'react';
import API from '../api';

export default function Inventory({ onLogout }) {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: 0, description: '' });

  // Fetch items from Django backend
  const fetchItems = async () => {
    try {
      const res = await API.get('items/');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Handle adding a new item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('items/', formData);
      setFormData({ name: '', quantity: 0, description: '' });
      fetchItems();
    } catch (err) {
      alert('Error creating item.');
    }
  };

  // Handle deleting an item
  const handleDelete = async (id) => {
    try {
      await API.delete(`items/${id}/`);
      fetchItems();
    } catch (err) {
      alert('Error deleting item.');
    }
  };

  return (
    <div>
      <h2>Inventory Dashboard</h2>
      <button onClick={onLogout}>Log Out</button>

      <form onSubmit={handleSubmit}>
        <h3>Add New Item</h3>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <br />
        <button type="submit">Add Item</button>
      </form>

      <h3>Items List</h3>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — Qty: {item.quantity} | {item.description}{' '}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}