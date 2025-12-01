// src/components/Layout.jsx
import React from 'react';

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Notes App (MERN)</h1>
          <div className="small">Simple app for the backend assignment</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {user ? (
            <>
              <div className="small">Signed in as <strong>{user.email}</strong></div>
              <div style={{ marginTop: 8 }}>
                <button className="ghost" onClick={onLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="small">Not signed in</div>
          )}
        </div>
      </div>

      <div className="card">
        {children}
      </div>
    </div>
  );
}
