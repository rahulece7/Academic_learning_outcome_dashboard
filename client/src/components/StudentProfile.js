import React from 'react';
import './StudentProfile.css';
import FeatherIcon from './FeatherIcon';

function StudentProfile({ user }) {
  const profileDetails = [
    { label: 'Name', value: user?.name, icon: 'userCircle' },
    { label: 'Roll Number', value: user?.rollNumber, icon: 'hash' },
    { label: 'Email ID', value: user?.email, icon: 'mail' },
    { label: 'Department', value: user?.department, icon: 'briefcase' },
    { label: 'Semester', value: user?.semester || 'N/A', icon: 'calendar' },
    { label: 'Year', value: user?.year || 'N/A', icon: 'award' }
  ];

  const mentorDetails = user?.mentor ? [
    { label: 'Mentor Name', value: user.mentor.name, icon: 'user' },
    { label: 'Mentor Email', value: user.mentor.email, icon: 'mail' },
    { label: 'Mentor Phone', value: user.mentor.phone, icon: 'phone' }
  ] : [];

  const academicDetails = [
    {
      label: 'Attendance',
      value: `${user?.attendance ?? 0}%`,
      icon: 'checkCircle',
      color: '#2f9e44',
      percent: Number(user?.attendance || 0)
    },
    {
      label: 'CGPA',
      value: user?.cgpa?.toFixed(2) || '0.00',
      icon: 'trendingUp',
      color: '#1c7ed6',
      percent: Math.min(100, Number(((user?.cgpa || 0) / 10) * 100))
    },
    {
      label: 'SGPA',
      value: user?.sgpa?.toFixed(2) || '0.00',
      icon: 'barChart2',
      color: '#e67700',
      percent: Math.min(100, Number(((user?.sgpa || 0) / 10) * 100))
    }
  ];

  return (
    <div className="student-profile">
      <section className="profile-banner">
        <div className="profile-banner-main">
          <div className="profile-avatar">
            <span className="avatar-icon"><FeatherIcon name="userCircle" size={40} /></span>
          </div>
          <div>
            <h2>{user?.name}</h2>
            <p>{user?.rollNumber} • {user?.email}</p>
          </div>
        </div>
        <div className="profile-badges">
          <span className="profile-badge"><FeatherIcon name="briefcase" size={14} /> {user?.department || 'N/A'}</span>
          <span className="profile-badge"><FeatherIcon name="award" size={14} /> Year {user?.year || 'N/A'}</span>
          <span className="profile-badge"><FeatherIcon name="calendar" size={14} /> Semester {user?.semester || 'N/A'}</span>
        </div>
      </section>

      <div className="profile-layout">
        <section className="profile-panel">
          <h3><FeatherIcon name="user" size={18} /> Personal Snapshot</h3>
          <div className="detail-stack">
            {profileDetails.map((detail, idx) => (
              <div key={idx} className="detail-row">
                <div className="detail-row-left">
                  <span className="detail-icon"><FeatherIcon name={detail.icon} size={16} /></span>
                  <label>{detail.label}</label>
                </div>
                <p>{detail.value || 'N/A'}</p>
              </div>
            ))}
          </div>

          {mentorDetails.length > 0 && (
            <div className="mentor-block">
              <h4><FeatherIcon name="users" size={16} /> Mentor Details</h4>
              {mentorDetails.map((detail, idx) => (
                <div key={idx} className="detail-row compact">
                  <div className="detail-row-left">
                    <span className="detail-icon"><FeatherIcon name={detail.icon} size={16} /></span>
                    <label>{detail.label}</label>
                  </div>
                  <p>{detail.value || 'N/A'}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="profile-panel performance-panel">
          <h3><FeatherIcon name="activity" size={18} /> Academic Performance</h3>
          <div className="metrics-stack">
            {academicDetails.map((detail, idx) => (
              <div key={idx} className="metric-card">
                <div className="academic-icon" style={{ backgroundColor: detail.color }}>
                  <FeatherIcon name={detail.icon} size={20} color="#fff" />
                </div>
                <div className="metric-content">
                  <div className="metric-head">
                    <label>{detail.label}</label>
                    <p className="academic-value">{detail.value}</p>
                  </div>
                  <div className="metric-track">
                    <span className="metric-fill" style={{ width: `${detail.percent}%`, backgroundColor: detail.color }}></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="profile-footer">
        <p><FeatherIcon name="clock" size={14} /> Last Updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default StudentProfile;
