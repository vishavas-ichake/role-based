// src/components/NoteList.jsx
import React from 'react';
import { api } from '../api';

export default function NoteList({ notes, refresh }) {
  const del = async (id) => {
    if (!confirm('Delete note?')) return;
    const { status } = await api(`/notes/${id}`, { method: 'DELETE' });
    if (status === 204) refresh();
    else alert('Delete failed');
  };

  const edit = async (id) => {
    const newTitle = prompt('New title');
    if (!newTitle) return;
    const { status } = await api(`/notes/${id}`, { method: 'PUT', body: JSON.stringify({ title: newTitle }) });
    if (status === 200) refresh();
    else alert('Update failed');
  };

  if (!notes || notes.length === 0) return <div className="small">No notes yet</div>;

  return (
    <div>
      {notes.map(n => (
        <div className="note" key={n._id || n.id}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <strong>{n.title}</strong>
            <div className="small">{new Date(n.createdAt || n.updatedAt).toLocaleString()}</div>
          </div>
          <div style={{ marginTop:6, whiteSpace:'pre-wrap' }}>{n.content}</div>
          <div className="actions">
            <button className="ghost" onClick={()=>edit(n._id || n.id)}>Edit</button>
            <button className="" style={{ background:'#ef4444', color:'white' }} onClick={()=>del(n._id || n.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
