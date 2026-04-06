import React, { useEffect, useState } from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';
import { fetchOrMock } from '../utils/mockApi';
import { useAuth } from '../context/AuthContext';

function StudentAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (user?.role) params.append('targetRole', user.role);
      if (user?.department) params.append('department', user.department);

      const response = await fetchOrMock(`/api/announcements?${params.toString()}`);
      const json = await response.json();
      if (!json.success) throw new Error(json.error || 'Failed to load announcements');
      setAnnouncements(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
    const intervalId = setInterval(loadAnnouncements, 15000);
    return () => clearInterval(intervalId);
  }, [user?.role, user?.department]);

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FeatherIcon name="bell" size={24} /> Announcements</h2>
        <div className="section-actions">
          <button className="btn-secondary" onClick={loadAnnouncements}>Refresh</button>
        </div>
      </div>

      {loading && <p className="cert-loading">Loading announcements...</p>}
      {!loading && error && <p className="certificate-error">{error}</p>}
      {!loading && !error && announcements.length === 0 && (
        <p className="cert-loading">No announcements available.</p>
      )}

      {!loading && !error && announcements.length > 0 && (
        <div className="module-grid">
          {announcements.map((item) => (
            <div key={item._id || item.id} className="module-card">
              <div className="card-content">
                <h3>{item.title}</h3>
                <p className="card-description">{item.message}</p>
                <div className="card-footer">
                  <span className="status-badge pending">{item.type || 'General'}</span>
                  <span className="card-date"><FeatherIcon name="calendar" size={14} /> {formatDate(item.publishDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentAnnouncements;
