import React, { useState, useEffect } from 'react';
import './AdminComponents.css';
import Card from './ui/Card';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetchOrMock('/api/admin/analytics');
      const json = await response.json();
      if (json.success) {
        setAnalytics(json.data);
      } else {
        setError(json.error || 'Failed to load analytics');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Card className="admin-section"><p style={{textAlign:'center',color:'var(--muted)'}}>Loading analytics...</p></Card>;
  if (error) return <Card className="admin-section"><p style={{textAlign:'center',color:'#e74c3c'}}>Error: {error}</p></Card>;
  if (!analytics) return <Card className="admin-section"><p style={{textAlign:'center',color:'var(--muted)'}}>No data available</p></Card>;

  const analyticsCards = [
    { title: 'Total Students', value: analytics.totalStudents, icon: 'users', color: '#4299e1' },
    { title: 'Avg CGPA', value: analytics.avgCGPA, icon: 'barChart2', color: '#48bb78' },
    { title: 'Avg Attendance', value: analytics.avgAttendance + '%', icon: 'trendingUp', color: '#ed8936' },
    { title: 'Active Projects', value: analytics.activeProjects, icon: 'folder', color: '#9f7aea' }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="barChart2" size={28} /> System Analytics & Reports</h2>

      <div className="analytics-grid">
        {analyticsCards.map((item, idx) => (
          <div key={idx} className="analytics-card">
            <div className="analytics-icon" style={{ backgroundColor: item.color }}>
              <FeatherIcon name={item.icon} size={28} color="white" />
            </div>
            <div className="analytics-info">
              <p className="analytics-label">{item.title}</p>
              <p className="analytics-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics-sections">
        <div className="analytics-section">
          <h3>Department-wise Statistics</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Students</th>
                <th>Avg CGPA</th>
              </tr>
            </thead>
            <tbody>
              {(analytics.departmentStats || []).map((dept, idx) => (
                <tr key={idx}>
                  <td>{dept.name}</td>
                  <td><strong>{dept.students}</strong></td>
                  <td><span className="cgpa-badge">{dept.avgCGPA}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="analytics-section">
          <h3>Learning Outcome Completion</h3>
          <div className="outcome-list">
            {(analytics.learningOutcomeCompletion || []).map((outcome, idx) => (
              <div key={idx} className="outcome-item">
                <span className="outcome-label">{outcome.name}</span>
                <div className="outcome-progress">
                  <div className="progress-fill" style={{ width: `${outcome.completion}%` }}></div>
                </div>
                <span className="outcome-percentage">{outcome.completion}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AdminAnalytics;
