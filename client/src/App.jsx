// src/App.jsx
import React, { useEffect, useState } from 'react';
import { api } from './api';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login'); // 'login' | 'register' | 'dashboard'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status, body } = await api('/auth/me');
      if (status === 200) { setUser(body); setPage('dashboard'); }
      else { setUser(null); setPage('login'); }
      setLoading(false);
    })();
  }, []);

  const handleLogin = (u) => { setUser(u); setPage('dashboard'); };
  const handleLogout = () => { setUser(null); setPage('login'); };

  return (
    <Layout user={user} onLogout={handleLogout}>
      {loading ? <div className="small">Checking authentication...</div> : (
        <>
          {!user && page === 'login' && <Login onLogin={handleLogin} switchToRegister={()=>setPage('register')} />}
          {!user && page === 'register' && <Register onRegistered={()=>setPage('login')} switchToLogin={()=>setPage('login')} />}
          {user && <Dashboard user={user} onLogout={handleLogout} />}
        </>
      )}
    </Layout>
  );
}
