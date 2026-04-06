import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminComponents.css';
import Card from './ui/Card';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function AdminSubmissionVerifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [selected, setSelected] = useState(null);
  const [decision, setDecision] = useState('Approved');
  const [remarks, setRemarks] = useState('');

  const fetchItems = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams();
      if (activeFilters.type !== 'all') params.append('type', activeFilters.type);
      if (activeFilters.status !== 'all') params.append('status', activeFilters.status);

      const query = params.toString();
      const response = await fetchOrMock(`/api/admin/verifications${query ? `?${query}` : ''}`);
      const json = await response.json();
      if (!json.success) throw new Error(json.error || 'Failed to load submissions');
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(filters);
  }, [fetchItems]);

  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter(item => (item.verificationStatus || 'Pending') === 'Pending').length,
    approved: items.filter(item => item.verificationStatus === 'Approved').length,
    rejected: items.filter(item => item.verificationStatus === 'Rejected').length
  }), [items]);

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const typeLabel = (type) => {
    if (type === 'course') return 'Online Course';
    if (type === 'internship') return 'Internship';
    if (type === 'paper') return 'Paper';
    if (type === 'project') return 'Project';
    return 'Submission';
  };

  const applyFilters = async () => {
    await fetchItems(filters);
  };

  const openReview = (item) => {
    setSelected(item);
    setDecision('Approved');
    setRemarks('');
  };

  const handleDownloadProof = (item) => {
    if (!item.certificateFileData) {
      setError('Proof file is unavailable for this record. Ask student to re-upload proof file.');
      return;
    }

    const link = document.createElement('a');
    link.href = item.certificateFileData;
    link.download = item.certificateFileName || `${item.type || 'proof'}-file`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const submitDecision = async () => {
    if (!selected) return;

    if (decision === 'Rejected' && !remarks.trim()) {
      setError('Remarks are required when rejecting a submission.');
      return;
    }

    try {
      setError('');
      const response = await fetchOrMock(`/api/admin/verifications/${selected.type}/${selected.id || selected._id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: decision,
          reviewRemarks: decision === 'Rejected' ? remarks.trim() : ''
        })
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit decision');
      }
      setSelected(null);
      setRemarks('');
      await fetchItems(filters);
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit decision');
    }
  };

  if (loading) {
    return <Card className="admin-section"><p className="muted" style={{ textAlign: 'center' }}>Loading verifications...</p></Card>;
  }

  return (
    <Card className="admin-section">
      <div className="section-header">
        <div>
          <h2><FeatherIcon name="checkCircle" size={28} /> Student Submission Verifications</h2>
          <div className="section-stats">
            <span className="stat">Total: {stats.total}</span>
            <span className="stat">Pending: {stats.pending}</span>
            <span className="stat">Approved: {stats.approved}</span>
            <span className="stat">Rejected: {stats.rejected}</span>
          </div>
        </div>
      </div>

      <div className="admin-review-guidance">
        <p>All student uploads for internships, paper presentations, and online courses appear here for verification.</p>
        <p>Approve only after validating details and proof file. If rejecting, remarks are mandatory.</p>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Type</label>
          <select className="filter-select" value={filters.type} onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}>
            <option value="all">All Types</option>
            <option value="internship">Internship</option>
            <option value="paper">Paper Presentation</option>
            <option value="course">Online Course</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select className="filter-select" value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}>
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button className="btn-secondary" onClick={applyFilters}>Apply Filters</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Student</th>
              <th>Register No</th>
              <th>Department</th>
              <th>Title</th>
              <th>Organization</th>
              <th>Proof File</th>
              <th>Verification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.type}-${item.id || item._id}`}>
                <td>{typeLabel(item.type)}</td>
                <td>{item.studentName || 'N/A'}</td>
                <td>{item.registerNumber || 'N/A'}</td>
                <td>{item.department || 'N/A'}</td>
                <td>{item.title || 'N/A'}</td>
                <td>{item.name || 'N/A'}</td>
                <td>{item.certificateFileName || 'N/A'}</td>
                <td><span className={`status-badge ${String(item.verificationStatus || 'Pending').toLowerCase()}`}>{item.verificationStatus || 'Pending'}</span></td>
                <td>
                  <div className="cert-action-row">
                    <button className="btn-secondary" onClick={() => handleDownloadProof(item)}>Download</button>
                    <button className="btn-secondary" onClick={() => openReview(item)}>Review</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center' }}>No submissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-review-panel">
          <h3><FeatherIcon name="eye" size={18} /> Review Submission</h3>
          <div className="admin-grid-two">
            <div className="admin-card">
              <p><strong>Type:</strong> {typeLabel(selected.type)}</p>
              <p><strong>Student:</strong> {selected.studentName || 'N/A'}</p>
              <p><strong>Register Number:</strong> {selected.registerNumber || 'N/A'}</p>
              <p><strong>Department:</strong> {selected.department || 'N/A'}</p>
              <p><strong>Title:</strong> {selected.title || 'N/A'}</p>
              <p><strong>Organization:</strong> {selected.name || 'N/A'}</p>
              <p><strong>Status:</strong> {selected.status || 'N/A'}</p>
              <p><strong>Date:</strong> {selected.date || formatDate(selected.createdAt)}</p>
              <p><strong>Proof File:</strong> {selected.certificateFileName || 'N/A'}</p>
              {selected.verificationStatus === 'Rejected' && selected.reviewRemarks && (
                <p className="admin-rejection-reason"><strong>Current Remarks:</strong> {selected.reviewRemarks}</p>
              )}
              {selected.reviewedAt && (
                <p className="admin-verified-line"><strong>Reviewed At:</strong> {formatDate(selected.reviewedAt)}</p>
              )}
            </div>

            <div className="admin-card">
              <h3><FeatherIcon name="shield" size={18} /> Decision</h3>
              <div className="form-group">
                <label>Decision</label>
                <select className="form-input" value={decision} onChange={(e) => setDecision(e.target.value)}>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>

              {decision === 'Rejected' && (
                <div className="form-group" style={{ marginTop: 10 }}>
                  <label>Remarks (Required)</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter rejection reason for the student"
                  />
                </div>
              )}

              <div className="cert-action-row" style={{ marginTop: 14 }}>
                <button className="btn-secondary" onClick={submitDecision}>Submit</button>
                <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

export default AdminSubmissionVerifications;
