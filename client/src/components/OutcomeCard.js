import React from 'react';
import './OutcomeCard.css';

function OutcomeCard({ outcome, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      case 'Not Started':
        return 'status-not-started';
      default:
        return 'status-default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return '✓';
      case 'In Progress':
        return '⚙️';
      case 'Not Started':
        return '○';
      default:
        return '•';
    }
  };

  return (
    <div className="outcome-card">
      <div className="card-header">
        <h3>{outcome.title}</h3>
        <span className={`status-badge ${getStatusColor(outcome.status)}`}>
          {getStatusIcon(outcome.status)} {outcome.status}
        </span>
      </div>

      <p className="card-description">{outcome.description}</p>

      <div className="progress-section">
        <div className="progress-label">
          <span>Progress</span>
          <span className="progress-percent">{outcome.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${outcome.progress}%` }}
          ></div>
        </div>
      </div>

      <div className="card-footer">
        <button 
          className="btn btn-small btn-warning"
          onClick={() => onEdit(outcome)}
        >
          ✎ Edit
        </button>
        <button 
          className="btn btn-small btn-danger"
          onClick={() => onDelete(outcome.id)}
        >
          ✕ Delete
        </button>
      </div>
    </div>
  );
}

export default OutcomeCard;
