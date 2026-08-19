import { useState } from 'react';
import API from '../api';

export default function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('users/register/', formData);
      alert('Registration successful!');
      onSwitchToLogin();
    } catch (err) {
      setError('Registration failed. Username or email may already be taken.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>
        Already registered?{' '}
        <button type="button" onClick={onSwitchToLogin}>
          Log In
        </button>
      </p>
    </div>
  );
}