import React from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';

function StudentAcademics({ user }) {
  const subjects = user?.subjects || [];
  const gradeHistory = user?.gradeHistory || [];

  const getGradeColor = (grade) => {
    const gradeColors = {
      'A+': '#10b981', 'A': '#10b981', 'B+': '#3b82f6', 
      'B': '#3b82f6', 'C+': '#f59e0b', 'C': '#f59e0b',
      'D': '#ef4444', 'F': '#dc2626'
    };
    return gradeColors[grade] || '#6b7280';
  };

  return (
    <div className="student-module">
      <div className="module-header">
        <h2><FeatherIcon name="bookOpen" size={24} /> Academic Performance</h2>
        <p>Subject-wise marks and grade history</p>
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="fileText" size={18} /> Current Semester Subjects</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Internal</th>
                <th>External</th>
                <th>Total</th>
                <th>Grade</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, idx) => (
                <tr key={idx}>
                  <td><strong>{subject.code}</strong></td>
                  <td>{subject.name}</td>
                  <td>{subject.internal}/50</td>
                  <td>{subject.external}/100</td>
                  <td><strong>{subject.total}/150</strong></td>
                  <td>
                    <span className="grade-badge" style={{ backgroundColor: getGradeColor(subject.grade) }}>
                      {subject.grade}
                    </span>
                  </td>
                  <td>{subject.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="trendingUp" size={18} /> Grade History</h3>
        <div className="grade-history-grid">
          {gradeHistory.map((record, idx) => (
            <div key={idx} className="grade-card">
              <div className="grade-card-header">
                <h4>Semester {record.semester}</h4>
                <span className="grade-year">Year {record.year}</span>
              </div>
              <div className="grade-stats">
                <div className="grade-stat">
                  <label>SGPA</label>
                  <p className="stat-value">{record.sgpa}</p>
                </div>
                <div className="grade-stat">
                  <label>CGPA</label>
                  <p className="stat-value">{record.cgpa}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentAcademics;
