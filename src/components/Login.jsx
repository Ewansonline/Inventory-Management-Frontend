import { useState } from 'react';
import API from '../api'; // Adjust path if you put api.js inside a services folder

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post('users/login/', formData);
    
    console.log('Login API Response:', res.data);

    //token capture whether token or key
    const token = res.data.token || res.data.key;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data));
      setError('');
      if (onLoginSuccess) onLoginSuccess(res.data);
      alert('Login successful!');
    } else {
      setError('Token not found in server response.');
    }
  } catch (err) {
    setError('Invalid username or password.');
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}