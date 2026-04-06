import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminSummary() {
  const kpis = [
    { label: 'Total Students', value: '1,248', icon: 'users', color: '#3b82f6' },
    { label: 'Pass Percentage', value: '92%', icon: 'checkCircle', color: '#10b981' },
    { label: 'Average CGPA', value: '8.1', icon: 'barChart2', color: '#6366f1' },
    { label: 'Placement Rate', value: '78%', icon: 'briefcase', color: '#f59e0b' }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="activity" size={28} /> Overall Summary</h2>
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card">
            <div className="kpi-icon" style={{ backgroundColor: kpi.color }}>
              <FeatherIcon name={kpi.icon} size={22} color="#fff" />
            </div>
            <div>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default AdminSummary;
