import React from 'react';
import './StudentSidebar.css';
import FeatherIcon from './FeatherIcon';

function StudentSidebar({ activeModule, onModuleChange }) {
  const modules = [
    { id: 'profile', label: 'Profile', icon: 'user' },
    { id: 'announcements', label: 'Announcements', icon: 'bell' },
    { id: 'outcomes', label: 'Outcome', icon: 'target' },
    { id: 'projects', label: 'Projects', icon: 'folder' },
    { id: 'internships', label: 'Internships', icon: 'briefcase' },
    { id: 'certifications', label: 'Certifications', icon: 'award' },
    { id: 'verification', label: 'Verification Status', icon: 'checkCircle' },
    { id: 'courses', label: 'Online Courses', icon: 'bookOpen' },
    { id: 'papers', label: 'Paper Presentation', icon: 'fileText' }
  ];

  return (
    <aside className="student-sidebar">
      <nav className="sidebar-nav">
        {modules.map(module => (
          <button
            key={module.id}
            className={`nav-item ${activeModule === module.id ? 'active' : ''}`}
            onClick={() => onModuleChange(module.id)}
            title={module.label}
          >
            <span className="nav-icon"><FeatherIcon name={module.icon} size={18} /></span>
            <span className="nav-label">{module.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default StudentSidebar;
