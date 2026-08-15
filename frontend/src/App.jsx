import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  // Check if user is already logged in
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return <DashboardPage onLogout={handleLogout} />;
  }

  if (showRegister) {
    return (
      <RegisterPage
        onRegister={handleLogin}
        onGoLogin={() => setShowRegister(false)}
      />
    );
  }

  return (
    <LoginPage
      onLogin={handleLogin}
      onGoRegister={() => setShowRegister(true)}
    />
  );
}

export default App;
