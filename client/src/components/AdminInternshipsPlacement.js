import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminInternshipsPlacement() {
  const stats = [
    { label: 'Eligible Students', value: 620 },
    { label: 'Placed Students', value: 485 },
    { label: 'Average Salary', value: '6.8 LPA' }
  ];

  const companySelections = [
    { company: 'TechCorp', selected: 42, offer: 'Accepted' },
    { company: 'Innova Labs', selected: 30, offer: 'In Progress' },
    { company: 'CloudNine', selected: 26, offer: 'Accepted' }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="briefcase" size={28} /> Internship & Placement</h2>

      <div className="kpi-grid">
        {stats.map((s, idx) => (
          <div key={idx} className="kpi-card">
            <div className="kpi-label">{s.label}</div>
            <div className="kpi-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3><FeatherIcon name="building" size={18} /> Company-wise Selections</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Selected</th>
                <th>Offer Status</th>
              </tr>
            </thead>
            <tbody>
              {companySelections.map((c, idx) => (
                <tr key={idx}>
                  <td>{c.company}</td>
                  <td>{c.selected}</td>
                  <td><span className="status-pill ok">{c.offer}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}

export default AdminInternshipsPlacement;
