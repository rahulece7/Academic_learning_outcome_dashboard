import React from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';

function StudentAttendance({ user }) {
  const subjects = user?.subjects || [];
  const overallAttendance = user?.attendance || 0;
  const attendanceThreshold = 75;

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 85) return { color: '#10b981', status: 'Excellent' };
    if (percentage >= attendanceThreshold) return { color: '#3b82f6', status: 'Good' };
    if (percentage >= 65) return { color: '#f59e0b', status: 'Warning' };
    return { color: '#ef4444', status: 'Critical' };
  };

  const overallStatus = getAttendanceStatus(overallAttendance);

  return (
    <div className="student-module">
      <div className="module-header">
        <h2><FeatherIcon name="checkCircle" size={24} /> Attendance</h2>
        <p>Track your class attendance</p>
      </div>

      <div className="attendance-summary">
        <div className="attendance-card-large">
          <div className="attendance-icon-large" style={{ backgroundColor: overallStatus.color }}>
            <FeatherIcon name="calendar" size={32} color="#fff" />
          </div>
          <div className="attendance-info-large">
            <h3>Overall Attendance</h3>
            <p className="attendance-percentage-large">{overallAttendance}%</p>
            <span className="attendance-status" style={{ color: overallStatus.color }}>
              {overallStatus.status}
            </span>
          </div>
        </div>

        {overallAttendance < attendanceThreshold && (
          <div className="alert alert-warning">
            <FeatherIcon name="alertTriangle" size={18} />
            <span>Your attendance is below the required threshold of {attendanceThreshold}%</span>
          </div>
        )}
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="list" size={18} /> Subject-wise Attendance</h3>
        <div className="attendance-list">
          {subjects.map((subject, idx) => {
            const status = getAttendanceStatus(subject.attendance || 0);
            return (
              <div key={idx} className="attendance-item">
                <div className="attendance-subject-info">
                  <h4>{subject.name}</h4>
                  <span className="subject-code">{subject.code}</span>
                </div>
                <div className="attendance-bar-container">
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill" 
                      style={{ width: `${subject.attendance}%`, backgroundColor: status.color }}
                    />
                  </div>
                  <span className="attendance-value" style={{ color: status.color }}>
                    {subject.attendance}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StudentAttendance;
