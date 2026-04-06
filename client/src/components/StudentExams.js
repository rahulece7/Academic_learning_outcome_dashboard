import React from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';

function StudentExams({ user }) {
  const exams = user?.exams || [];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const upcomingExams = exams.filter(e => new Date(e.date) >= new Date() && !e.resultPublished);
  const completedExams = exams.filter(e => e.resultPublished);

  return (
    <div className="student-module">
      <div className="module-header">
        <h2><FeatherIcon name="clipboard" size={24} /> Exams & Results</h2>
        <p>Exam schedule and results</p>
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="calendar" size={18} /> Upcoming Exams</h3>
        {upcomingExams.length > 0 ? (
          <div className="exams-list">
            {upcomingExams.map((exam, idx) => (
              <div key={idx} className="exam-card upcoming">
                <div className="exam-icon" style={{ backgroundColor: '#3b82f6' }}>
                  <FeatherIcon name="fileText" size={24} color="#fff" />
                </div>
                <div className="exam-info">
                  <h4>{exam.name}</h4>
                  <p className="exam-subject">{exam.subject}</p>
                  <div className="exam-details">
                    <span><FeatherIcon name="calendar" size={14} /> {formatDate(exam.date)}</span>
                    <span><FeatherIcon name="creditCard" size={14} /> Hall Ticket: {exam.hallTicket}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FeatherIcon name="checkCircle" size={32} />
            <p>No upcoming exams</p>
          </div>
        )}
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="award" size={18} /> Results Published</h3>
        {completedExams.length > 0 ? (
          <div className="exams-list">
            {completedExams.map((exam, idx) => (
              <div key={idx} className="exam-card completed">
                <div className="exam-icon" style={{ backgroundColor: '#10b981' }}>
                  <FeatherIcon name="checkCircle" size={24} color="#fff" />
                </div>
                <div className="exam-info">
                  <h4>{exam.name}</h4>
                  <p className="exam-subject">{exam.subject}</p>
                  <div className="exam-details">
                    <span><FeatherIcon name="calendar" size={14} /> {formatDate(exam.date)}</span>
                    {exam.marks !== null && (
                      <span className="exam-marks"><FeatherIcon name="award" size={14} /> Marks: {exam.marks}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FeatherIcon name="clock" size={32} />
            <p>No results published yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentExams;
