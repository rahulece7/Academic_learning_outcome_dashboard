import React from 'react';
import '../../styles/design-system.css';
import './Card.css';

export default function Card({ children, className = '', hover = true }) {
  return (
    <div className={`ds-card ${hover ? 'ds-animate' : ''} ${className}`}>
      {children}
    </div>
  );
}
