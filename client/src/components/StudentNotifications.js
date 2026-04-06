import React, { useState } from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';

function StudentNotifications({ user }) {
  const [notifications, setNotifications] = useState(user?.notifications || []);

  const getTypeIcon = (type) => {
    const icons = {
      'Exam': 'clipboard',
      'Event': 'calendar',
      'Circular': 'fileText',
      'General': 'bell'
    };
    return icons[type] || 'bell';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Exam': '#ef4444',
      'Event': '#3b82f6',
      'Circular': '#8b5cf6',
      'General': '#6b7280'
    };
    return colors[type] || '#6b7280';
  };

  const formatDate = (date) => {
    const notifDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - notifDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return notifDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const markAsRead = (idx) => {
    const updated = [...notifications];
    updated[idx].read = true;
    setNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="student-module">
      <div className="module-header">
        <div>
          <h2><FeatherIcon name="bell" size={24} /> Notifications</h2>
          <p>Stay updated with latest announcements</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="alert alert-info">
          <FeatherIcon name="info" size={18} />
          <span>You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
        </div>
      )}

      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map((notification, idx) => (
            <div 
              key={idx} 
              className={`notification-card ${!notification.read ? 'unread' : ''}`}
              onClick={() => !notification.read && markAsRead(idx)}
            >
              <div className="notification-icon" style={{ backgroundColor: getTypeColor(notification.type) }}>
                <FeatherIcon name={getTypeIcon(notification.type)} size={20} color="#fff" />
              </div>
              <div className="notification-content">
                <div className="notification-header">
                  <h4>{notification.title}</h4>
                  {!notification.read && <span className="unread-badge"></span>}
                </div>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-footer">
                  <span className="notification-type">{notification.type}</span>
                  <span className="notification-date">
                    <FeatherIcon name="clock" size={12} /> {formatDate(notification.date)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <FeatherIcon name="bell" size={48} />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentNotifications;
