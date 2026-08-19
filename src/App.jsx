import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (token) {
    return (
      <main>
        <h2>Logged In Successfully!</h2>
        <p>Authentication complete. </p>
        <button onClick={handleLogout}>Log Out</button>
      </main>
    );
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