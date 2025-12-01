// src/components/NoteForm.jsx
import React, { useState } from 'react';
import { api } from '../api';

export default function NoteForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title required');
    setBusy(true);
    const { status, body } = await api('/notes', { method: 'POST', body: JSON.stringify({ title, content }) });
    setBusy(false);
    if (status === 201) {
      setTitle(''); setContent('');
      onCreated && onCreated(body);
    } else alert(body?.message || 'Could not create note');
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <label>Title
        <input value={title} onChange={(e)=>setTitle(e.target.value)} />
      </label>
      <label style={{ marginTop:8 }}>Content
        <textarea rows={4} value={content} onChange={(e)=>setContent(e.target.value)} />
      </label>
      <div style={{ marginTop:8 }}>
        <button className="primary" disabled={busy}>{busy ? 'Saving...' : 'Create Note'}</button>
      </div>
    </form>
  );
}
