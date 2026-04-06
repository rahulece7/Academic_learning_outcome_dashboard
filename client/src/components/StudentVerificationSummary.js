import React, { useCallback, useEffect, useMemo, useState } from 'react';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function StudentVerificationSummary({ studentId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const id = studentId || '1';
      const [internshipsRes, papersRes, coursesRes] = await Promise.all([
        fetchOrMock(`/api/internships?studentId=${id}`),
        fetchOrMock(`/api/papers?studentId=${id}`),
        fetchOrMock(`/api/courses?studentId=${id}`)
      ]);

      const [internshipsJson, papersJson, coursesJson] = await Promise.all([
        internshipsRes.json(),
        papersRes.json(),
        coursesRes.json()
      ]);

      const internships = (Array.isArray(internshipsJson.data) ? internshipsJson.data : [])
        .map(item => ({ ...item, submissionType: 'Internship' }));
      const papers = (Array.isArray(papersJson.data) ? papersJson.data : [])
        .map(item => ({ ...item, submissionType: 'Paper Presentation' }));
      const courses = (Array.isArray(coursesJson.data) ? coursesJson.data : [])
        .map(item => ({ ...item, submissionType: 'Online Course' }));

      const merged = []
        .concat(internships)
        .concat(papers)
        .concat(courses);

      setItems(merged);
    } catch (loadError) {
      setError(loadError.message || 'Failed to load verification summary');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    loadSummary();
    const intervalId = setInterval(loadSummary, 15000);
    const onFocus = () => loadSummary();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, [loadSummary]);

  const stats = useMemo(() => {
    const statusOf = (item) => String(item.verificationStatus || 'Pending');
    return {
      total: items.length,
      pending: items.filter(item => statusOf(item) === 'Pending').length,
      approved: items.filter(item => statusOf(item) === 'Approved').length,
      rejected: items.filter(item => statusOf(item) === 'Rejected').length
    };
  }, [items]);

  const statusRows = useMemo(() => {
    const byType = {
      Internship: { pending: 0, approved: 0, rejected: 0 },
      'Paper Presentation': { pending: 0, approved: 0, rejected: 0 },
      'Online Course': { pending: 0, approved: 0, rejected: 0 }
    };

    items.forEach((item) => {
      const type = item.submissionType || 'Online Course';
      const status = String(item.verificationStatus || 'Pending');
      if (!byType[type]) byType[type] = { pending: 0, approved: 0, rejected: 0 };

      if (status === 'Approved') byType[type].approved += 1;
      else if (status === 'Rejected') byType[type].rejected += 1;
      else byType[type].pending += 1;
    });

    return Object.entries(byType).map(([type, counts]) => ({
      type,
      ...counts
    }));
  }, [items]);

  return (
    <section className="verification-summary-card">
      <div className="verification-summary-header">
        <h3><FeatherIcon name="checkCircle" size={20} /> Verification Status</h3>
        <button className="btn-secondary" onClick={loadSummary}>Refresh</button>
      </div>

      {loading ? (
        <p className="verification-summary-muted">Loading status...</p>
      ) : (
        <div className="verification-summary-grid">
          <div className="verification-tile total">
            <span className="verification-label">Total</span>
            <span className="verification-value">{stats.total}</span>
          </div>
          <div className="verification-tile pending">
            <span className="verification-label">Pending</span>
            <span className="verification-value">{stats.pending}</span>
          </div>
          <div className="verification-tile approved">
            <span className="verification-label">Approved</span>
            <span className="verification-value">{stats.approved}</span>
          </div>
          <div className="verification-tile rejected">
            <span className="verification-label">Rejected</span>
            <span className="verification-value">{stats.rejected}</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className="verification-status-table-wrap">
          <table className="verification-status-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Pending</th>
                <th>Approved</th>
                <th>Rejected</th>
              </tr>
            </thead>
            <tbody>
              {statusRows.map((row) => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td>{row.pending}</td>
                  <td>{row.approved}</td>
                  <td>{row.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="verification-summary-error">{error}</p>}
      <p className="verification-summary-muted">Includes internships, paper presentations, and online courses.</p>
    </section>
  );
}

export default StudentVerificationSummary;
