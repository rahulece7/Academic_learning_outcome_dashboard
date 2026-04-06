import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminReports() {
  const reports = [
    { title: 'NBA Outcome Report', desc: 'CO/PO attainment and compliance', type: 'NBA' },
    { title: 'NAAC Accreditation Report', desc: 'Department quality metrics', type: 'NAAC' },
    { title: 'Semester Outcome Report', desc: 'Subject-wise attainment summary', type: 'Outcome' }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="fileText" size={28} /> Reports Generation</h2>
      <div className="report-grid">
        {reports.map((r, idx) => (
          <div key={idx} className="report-card">
            <div className="report-icon">
              <FeatherIcon name="fileText" size={24} />
            </div>
            <div className="report-content">
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
              <div className="report-actions">
                <button className="btn-secondary">Export PDF</button>
                <button className="btn-secondary">Export Excel</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AdminReports;
