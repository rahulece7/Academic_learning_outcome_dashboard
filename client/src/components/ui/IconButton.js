import React from 'react';
import './IconButton.css';

export default function IconButton({ icon, label, onClick, className = '' }) {
  return (
    <button className={`ds-icon-btn ${className}`} onClick={onClick} title={label}>
      <span className="icon">{icon}</span>
    </button>
  );
}
