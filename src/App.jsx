import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Inventory from './components/Inventory';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (token) {
    return <Inventory onLogout={handleLogout} />;
  }

  return (
    <main>
      {isRegistering ? (
        <Register onSwitchToLogin={() => setIsRegistering(false)} />
      ) : (
        <div>
          <Login onLoginSuccess={() => setToken(localStorage.getItem('token'))} />
          <p>
            Need to register?{' '}
            <button type="button" onClick={() => setIsRegistering(true)}>
              Register
            </button>
          </p>
        </div>
      )}
    </main>
  );
}

export default App;