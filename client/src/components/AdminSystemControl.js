import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminSystemControl() {
  const roles = [
    { role: 'Admin', users: 4 },
    { role: 'Faculty', users: 62 },
    { role: 'Student', users: 1248 }
  ];

  const permissions = [
    { name: 'Edit Student Records', level: 'Admin' },
    { name: 'Publish Results', level: 'Admin' },
    { name: 'View Analytics', level: 'Faculty' }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="settings" size={28} /> System Control</h2>

      <div className="admin-grid-two">
        <div className="admin-card">
          <h3><FeatherIcon name="shield" size={18} /> Role Management</h3>
          <ul className="simple-list">
            {roles.map((r, idx) => (
              <li key={idx}>
                <span>{r.role}</span>
                <span className="chip">{r.users} users</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card">
          <h3><FeatherIcon name="database" size={18} /> Data Backup</h3>
          <p className="muted">Last backup: Feb 12, 2026 • 02:30 AM</p>
          <button className="btn-secondary">Run Backup Now</button>
        </div>
      </div>

      <div className="admin-card">
        <h3><FeatherIcon name="lock" size={18} /> Access Permissions</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.name}</td>
                  <td><span className="status-pill ok">{p.level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

export default AdminSystemControl;
