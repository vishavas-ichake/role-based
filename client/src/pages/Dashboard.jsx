// src/pages/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import NoteForm from '../components/NoteForm';
import NoteList from '../components/NoteList';

export default function Dashboard({ user, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { status, body } = await api('/notes');
    setLoading(false);
    if (status === 200) setNotes(body);
    else if (status === 401) {
      // server said not authenticated — logout client
      onLogout();
    } else {
      alert('Failed to load notes');
    }
  }, [onLogout]);

  useEffect(()=>{ load(); }, [load]);

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    onLogout();
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Dashboard</h2>
        <div>
          <span className="small">Signed in as {user.email}</span>
          <div style={{ marginTop:8 }}>
            <button className="ghost" onClick={logout}>Logout</button>
          </div>
        </div>
      </div>

      <hr />
      <NoteForm onCreated={()=>load()} />
      {loading ? <div className="small">Loading notes...</div> : <NoteList notes={notes} refresh={load} />}
    </div>
  );
}
