import React from 'react';
import '../../styles/design-system.css';
import './Button.css';

export default function Button({ children, variant = 'primary', onClick, className = '', ...props }) {
  return (
    <button
      className={`ds-btn ds-btn-${variant} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
