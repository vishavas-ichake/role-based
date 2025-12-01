// src/pages/Login.jsx
import React, { useState } from 'react';
import { api } from '../api';

export default function Login({ onLogin, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { status, body } = await api('/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password })
    });
    setBusy(false);
    if (status === 200) {
      onLogin(body.user);
    } else {
      setErr(body?.message || 'Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Email
          <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label style={{ marginTop:8 }}>Password
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </label>
        <div style={{ marginTop:12, display:'flex', gap:8 }}>
          <button className="primary" disabled={busy}>{busy ? 'Logging...' : 'Login'}</button>
          <button type="button" className="ghost" onClick={switchToRegister}>Register</button>
        </div>
        {err && <div style={{ color:'var(--danger)', marginTop:8 }}>{err}</div>}
      </form>
    </div>
  );
}
