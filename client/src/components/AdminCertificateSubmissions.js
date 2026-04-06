import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminComponents.css';
import Card from './ui/Card';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function AdminCertificateSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('Approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filters, setFilters] = useState({
    department: 'all',
    status: 'all',
    fromDate: '',
    toDate: ''
  });

  const fetchSubmissions = useCallback(async (activeFilters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (activeFilters.department !== 'all') params.append('department', activeFilters.department);
      if (activeFilters.status !== 'all') params.append('status', activeFilters.status);
      if (activeFilters.fromDate) params.append('fromDate', activeFilters.fromDate);
      if (activeFilters.toDate) params.append('toDate', activeFilters.toDate);

      const query = params.toString();
      const response = await fetchOrMock(`/api/admin/certifications${query ? `?${query}` : ''}`);
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to load submissions');
      }
      const normalized = (Array.isArray(json.data) ? json.data : []).map((item) => ({
        ...item,
        courseName: item.courseName || item.title || '',
        platformName: item.platformName || item.companyName || item.organizationName || item.provider || '',
        courseDuration: item.courseDuration || item.internshipDuration || item.duration || '',
        completionDate: item.completionDate || item.endDate || item.startDate || null,
        certificateId: item.certificateId || '',
        adminRemarks: item.adminRemarks || item.rejectionReason || ''
      }));
      setSubmissions(normalized);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions({ department: 'all', status: 'all', fromDate: '', toDate: '' });
  }, [fetchSubmissions]);

  const stats = useMemo(() => {
    return {
      total: submissions.length,
      approved: submissions.filter(item => item.status === 'Approved').length,
      rejected: submissions.filter(item => item.status === 'Rejected').length,
      pending: submissions.filter(item => item.status === 'Pending').length
    };
  }, [submissions]);

  const departments = useMemo(() => {
    return Array.from(new Set(submissions.map(item => item.department).filter(Boolean)));
  }, [submissions]);

  const applyFilters = async () => {
    await fetchSubmissions(filters);
  };

  const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openPreview = (submission) => {
    setSelected(submission);
    setReviewStatus('Approved');
    setRejectionReason('');
  };

  const reviewSubmission = async () => {
    if (!selected) return;

    if (reviewStatus === 'Rejected' && !rejectionReason.trim()) {
      setError('Rejection reason is mandatory when rejecting a submission.');
      return;
    }

    try {
      setError('');
      const response = await fetchOrMock(`/api/admin/certifications/${selected.id || selected._id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewStatus,
          adminRemarks: reviewStatus === 'Rejected' ? rejectionReason.trim() : ''
        })
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to update status');
      }

      setSelected(null);
      setRejectionReason('');
      await fetchSubmissions(filters);
    } catch (reviewError) {
      setError(reviewError.message);
    }
  };

  const handleDownload = (submission) => {
    const fileData = submission.certificateFileData;
    if (!fileData) {
      setError('Download is unavailable for this record because file data is not stored.');
      return;
    }

    const link = document.createElement('a');
    link.href = fileData;
    link.download = submission.certificateFileName || 'certificate';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusClass = (status) => String(status || '').toLowerCase();

  if (loading) {
    return <Card className="admin-section"><p className="muted" style={{ textAlign: 'center' }}>Loading certificate submissions...</p></Card>;
  }

  return (
    <Card className="admin-section">
      <div className="section-header">
        <div>
          <h2><FeatherIcon name="clipboard" size={28} /> Course Certificate Submissions</h2>
          <div className="section-stats">
            <span className="stat">Total Submissions: {stats.total}</span>
            <span className="stat">Approved Count: {stats.approved}</span>
            <span className="stat">Rejected Count: {stats.rejected}</span>
            <span className="stat">Pending Count: {stats.pending}</span>
          </div>
        </div>
      </div>

      <div className="admin-review-guidance">
        <p>Reviewer checklist: verify student name, course title, issuing organization/platform, and completion date against the uploaded certificate proof.</p>
        <p><strong>Approve</strong> only when all details are valid. <strong>Reject</strong> when invalid/unclear and provide remarks so the student can correct and resubmit.</p>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label>Department</label>
          <select
            className="filter-select"
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          >
            <option value="all">All Departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>{department}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>From Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.fromDate}
            onChange={(e) => setFilters(prev => ({ ...prev, fromDate: e.target.value }))}
          />
        </div>

        <div className="filter-group">
          <label>To Date</label>
          <input
            type="date"
            className="form-input"
            value={filters.toDate}
            onChange={(e) => setFilters(prev => ({ ...prev, toDate: e.target.value }))}
          />
        </div>

        <button className="btn-secondary" onClick={applyFilters}>Apply Filters</button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Register Number</th>
              <th>Department</th>
              <th>Course Name</th>
              <th>Platform</th>
              <th>Completion Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((item) => (
              <tr key={item.id || item._id}>
                <td>{item.studentName}</td>
                <td>{item.registerNumber}</td>
                <td>{item.department}</td>
                <td>{item.courseName}</td>
                <td>{item.platformName}</td>
                <td>{formatDate(item.completionDate)}</td>
                <td>
                  <span className={`status-badge ${statusClass(item.status)}`}>{item.status}</span>
                  {item.status !== 'Pending' && item.reviewedAt && (
                    <div className="verification-meta">
                      <span className="verification-badge">Verification Complete</span>
                      <span className="verification-date">{formatDate(item.reviewedAt)}</span>
                    </div>
                  )}
                </td>
                <td>
                  <div className="cert-action-row">
                    <button className="btn-secondary" onClick={() => openPreview(item)}>Preview</button>
                    <button className="btn-secondary" onClick={() => handleDownload(item)}>Download</button>
                  </div>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No submissions found for selected filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="admin-review-panel">
          <h3><FeatherIcon name="eye" size={18} /> Submission Review</h3>
          <div className="admin-grid-two">
            <div className="admin-card">
              <p><strong>Name:</strong> {selected.studentName}</p>
              <p><strong>Register Number:</strong> {selected.registerNumber}</p>
              <p><strong>Department:</strong> {selected.department}</p>
              <p><strong>Course Name:</strong> {selected.courseName}</p>
              <p><strong>Platform Name:</strong> {selected.platformName}</p>
              <p><strong>Course Duration:</strong> {selected.courseDuration}</p>
              <p><strong>Completion Date:</strong> {formatDate(selected.completionDate)}</p>
              <p><strong>Certificate ID:</strong> {selected.certificateId || 'N/A'}</p>
              <p><strong>File:</strong> {selected.certificateFileName || 'N/A'}</p>
              {selected.status !== 'Pending' && selected.reviewedAt && (
                <p className="admin-verified-line"><strong>Verification Complete:</strong> {formatDate(selected.reviewedAt)}</p>
              )}
              {selected.status === 'Rejected' && selected.adminRemarks && (
                <p className="admin-rejection-reason"><strong>Admin Remarks:</strong> {selected.adminRemarks}</p>
              )}
            </div>

            <div className="admin-card">
              <h3><FeatherIcon name="shield" size={18} /> Approve / Reject</h3>
              <div className="form-group">
                <label>Decision</label>
                <select className="form-input" value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}>
                  <option value="Approved">Approve</option>
                  <option value="Rejected">Reject</option>
                </select>
              </div>

              {reviewStatus === 'Rejected' && (
                <div className="form-group" style={{ marginTop: 10 }}>
                  <label>Remarks / Comments (Required)</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter brief reason so student can correct and resubmit"
                  />
                </div>
              )}

              <div className="cert-action-row" style={{ marginTop: 14 }}>
                <button className="btn-secondary" onClick={reviewSubmission}>Submit Decision</button>
                <button className="btn-secondary" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          </div>

          {selected.certificateFileData ? (
            <div className="certificate-preview-box">
              <h3><FeatherIcon name="fileText" size={18} /> Certificate Preview</h3>
              {selected.certificateFileType === 'application/pdf' ? (
                <iframe title="Certificate Preview" src={selected.certificateFileData} className="certificate-preview-frame" />
              ) : (
                <img src={selected.certificateFileData} alt="Certificate" className="certificate-preview-image" />
              )}
            </div>
          ) : (
            <p className="muted" style={{ marginTop: 12 }}>Preview unavailable for this record.</p>
          )}
        </div>
      )}
    </Card>
  );
}

export default AdminCertificateSubmissions;
