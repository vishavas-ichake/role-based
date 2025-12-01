// src/pages/Register.jsx
import React, { useState } from 'react';
import { api } from '../api';

export default function Register({ onRegistered, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const { status, body } = await api('/auth/register', {
      method: 'POST', body: JSON.stringify({ name, email, password })
    });
    setBusy(false);
    if (status === 201) {
      onRegistered();
    } else setErr(body?.message || 'Registration failed');
  };

  return (
    <div style={{ maxWidth: 480 }}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <label>Name
          <input value={name} onChange={(e)=>setName(e.target.value)} />
        </label>
        <label style={{ marginTop:8 }}>Email
          <input value={email} onChange={(e)=>setEmail(e.target.value)} />
        </label>
        <label style={{ marginTop:8 }}>Password
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        </label>
        <div style={{ marginTop:12 }}>
          <button className="primary" disabled={busy}>{busy ? 'Please wait...' : 'Register'}</button>
          <button type="button" className="ghost" onClick={switchToLogin} style={{ marginLeft:8 }}>Back to Login</button>
        </div>
        {err && <div style={{ color:'var(--danger)', marginTop:8 }}>{err}</div>}
      </form>
    </div>
  );
}
