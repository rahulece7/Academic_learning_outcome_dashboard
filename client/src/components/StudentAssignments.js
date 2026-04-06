import React from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';

function StudentAssignments({ user }) {
  const assignments = user?.assignments || [];

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': '#10b981',
      'Pending': '#f59e0b',
      'Overdue': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Submitted': 'checkCircle',
      'Pending': 'clock',
      'Overdue': 'alertCircle'
    };
    return icons[status] || 'fileText';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const pendingAssignments = assignments.filter(a => a.status === 'Pending');
  const submittedAssignments = assignments.filter(a => a.status === 'Submitted');

  return (
    <div className="student-module">
      <div className="module-header">
        <h2><FeatherIcon name="fileText" size={24} /> Assignments & Tasks</h2>
        <p>Manage your assignments and submissions</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b' }}>
            <FeatherIcon name="clock" size={20} color="#fff" />
          </div>
          <div className="stat-info">
            <label>Pending</label>
            <p className="stat-value">{pendingAssignments.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b981' }}>
            <FeatherIcon name="checkCircle" size={20} color="#fff" />
          </div>
          <div className="stat-info">
            <label>Submitted</label>
            <p className="stat-value">{submittedAssignments.length}</p>
          </div>
        </div>
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="list" size={18} /> All Assignments</h3>
        <div className="assignments-list">
          {assignments.map((assignment, idx) => (
            <div key={idx} className="assignment-card">
              <div className="assignment-header">
                <div>
                  <h4>{assignment.title}</h4>
                  <span className="assignment-subject">{assignment.subject}</span>
                </div>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(assignment.status) }}
                >
                  <FeatherIcon name={getStatusIcon(assignment.status)} size={14} />
                  {assignment.status}
                </span>
              </div>
              <div className="assignment-details">
                <div className="assignment-detail">
                  <FeatherIcon name="calendar" size={16} />
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                </div>
                {assignment.marks !== null && (
                  <div className="assignment-detail">
                    <FeatherIcon name="award" size={16} />
                    <span>Marks: {assignment.marks}/{assignment.totalMarks}</span>
                  </div>
                )}
              </div>
              {assignment.feedback && (
                <div className="assignment-feedback">
                  <FeatherIcon name="messageCircle" size={14} />
                  <span>{assignment.feedback}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudentAssignments;
