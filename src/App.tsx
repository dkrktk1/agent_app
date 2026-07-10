import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import MainApp from './components/MainApp';

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('ag_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('ag_current_user', JSON.stringify(user));
    } catch(e) {
      console.warn('Could not save user to localStorage', e);
      // If it fails, try to save a stripped down version or clear
      localStorage.removeItem('ag_current_user');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ag_current_user');
  };

  return (
    <div className="phone-wrapper">
      <div className="phone-screen">
        {!currentUser ? (
          <AuthScreen onLogin={handleLogin} />
        ) : (
          <MainApp currentUser={currentUser} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
