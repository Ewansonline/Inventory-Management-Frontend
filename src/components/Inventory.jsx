import { useState, useEffect } from 'react';
import API from '../api';

export default function Inventory({ onLogout }) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    description: '',
    category: '',
    supplier: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch items from Django backend
  const fetchItems = async () => {
    try {
      const res = await API.get('items/');
      setItems(res.data);
    } catch (err) {
      console.error('Error fetching items:', err);
    }
  };

  const fetchCategoriesAndSuppliers = async () => {
    try {
      const [catRes, supRes] = await Promise.all([
        API.get('categories/'),
        API.get('suppliers/'),
      ]);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
    } catch (err) {
      console.error('Error fetching categories or suppliers:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategoriesAndSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      quantity: formData.quantity,
      description: formData.description,
      category: formData.category ? parseInt(formData.category) : null,
      supplier: formData.supplier ? parseInt(formData.supplier) : null,
      unit_price: 10.00,
      sku: `SKU-${Date.now()}`,
    };

    console.log('Submitting form data:', itemData);

    try {
      if (editingId) {
        await API.put(`items/${editingId}/`, itemData);
      } else {
        await API.post('items/', itemData);
      }
      resetForm();
      fetchItems();
    } catch (err) {
      alert(editingId ? 'Error updating item.' : 'Error creating item.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      description: item.description || '',
      category: item.category?.id || item.category || '',
      supplier: item.supplier?.id || item.supplier || '',
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      quantity: 0,
      description: '',
      category: '',
      supplier: '',
    });
  };

  // Handle deleting an item
  const handleDelete = async (id) => {
    try {
      await API.delete(`items/${id}/`);
      if (editingId === id) {
        resetForm();
      }
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
        <h3>{editingId ? 'Edit Item' : 'Add New Item'}</h3>
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
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <select
          value={formData.supplier}
          onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
        >
          <option value="">Select Supplier</option>
          {suppliers.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">{editingId ? 'Update Item' : 'Add Item'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <h3>Items List</h3>
      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> — Qty: {item.quantity} | {item.description}{' '}
              <button onClick={() => handleEdit(item)}>Edit</button>{' '}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}