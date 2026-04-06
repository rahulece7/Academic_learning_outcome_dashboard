import React, { useEffect, useState } from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';
import { fetchOrMock } from '../utils/mockApi';
import { useAuth } from '../context/AuthContext';

function AdminAnnouncements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    type: 'General',
    message: ''
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetchOrMock('/api/announcements');
      const data = await response.json();
      if (!data.success) {
        setError(data.error || 'Failed to load announcements');
        return;
      }
      setAnnouncements(data.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required');
      return;
    }

    try {
      setError('');
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          message: form.message.trim(),
          type: form.type,
          targetRole: 'all',
          department: 'All',
          publishedBy: user?.name || 'Admin'
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.error || 'Failed to publish announcement');
        return;
      }

      setAnnouncements(prev => [data.data, ...prev]);
      setForm({ title: '', type: 'General', message: '' });
    } catch (err) {
      setError(err.message || 'Failed to publish announcement');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="bell" size={28} /> Announcements</h2>

      <div className="admin-grid-two">
        <div className="admin-card">
          <h3><FeatherIcon name="send" size={18} /> Send Notice</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Title</label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Announcement title"
              />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select className="form-input" name="type" value={form.type} onChange={handleChange}>
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
                <option value="Circular">Circular</option>
              </select>
            </div>
            <div className="form-group form-group-full">
              <label>Message</label>
              <textarea
                className="form-input"
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                placeholder="Write announcement message"
              />
            </div>
            <div className="form-group form-group-full">
              <button className="btn-secondary" onClick={handleSubmit}>Publish</button>
            </div>
            {error && (
              <div className="form-group form-group-full">
                <span className="muted">{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="admin-card">
          <h3><FeatherIcon name="list" size={18} /> Recent Announcements</h3>
          <ul className="simple-list">
            {loading && <li><span>Loading announcements...</span></li>}
            {!loading && announcements.length === 0 && <li><span>No announcements yet</span></li>}
            {!loading && announcements.map((a) => (
              <li key={a._id || a.id}>
                <span>{a.title}</span>
                <span className="chip">{a.type}</span>
                <span className="muted">{formatDate(a.publishDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default AdminAnnouncements;
