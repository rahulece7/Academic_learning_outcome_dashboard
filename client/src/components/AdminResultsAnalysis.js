import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminResultsAnalysis() {
  const passFail = [
    { label: 'Pass', value: 92, color: '#10b981' },
    { label: 'Fail', value: 8, color: '#ef4444' }
  ];

  const topPerformers = [
    { name: 'Arjun Sharma', roll: 'A101', cgpa: 9.2 },
    { name: 'Priya Rao', roll: 'A104', cgpa: 9.1 },
    { name: 'Vikram Sen', roll: 'A119', cgpa: 9.0 }
  ];

  const subjectDifficulty = [
    { subject: 'Operating Systems', difficulty: 'High' },
    { subject: 'Computer Networks', difficulty: 'Medium' },
    { subject: 'Data Structures', difficulty: 'Low' }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="barChart" size={28} /> Results & Analysis</h2>

      <div className="kpi-grid">
        {passFail.map((p, idx) => (
          <div key={idx} className="kpi-card">
            <div className="kpi-label">{p.label} Percentage</div>
            <div className="kpi-value" style={{ color: p.color }}>{p.value}%</div>
            <div className="progress-bar-sm">
              <div className="progress-fill" style={{ width: `${p.value}%`, backgroundColor: p.color }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-grid-two">
        <div className="admin-card">
          <h3><FeatherIcon name="award" size={18} /> Top Performers</h3>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll</th>
                  <th>CGPA</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((t, idx) => (
                  <tr key={idx}>
                    <td>{t.name}</td>
                    <td>{t.roll}</td>
                    <td><span className="rating-badge">{t.cgpa}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <h3><FeatherIcon name="trendingDown" size={18} /> Subject Difficulty</h3>
          <ul className="simple-list">
            {subjectDifficulty.map((s, idx) => (
              <li key={idx}>
                <span>{s.subject}</span>
                <span className={`chip ${s.difficulty.toLowerCase()}`}>{s.difficulty}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default AdminResultsAnalysis;
