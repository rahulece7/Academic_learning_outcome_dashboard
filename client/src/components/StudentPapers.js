import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './StudentModules.css';
import { useAuth } from '../context/AuthContext';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function StudentPapers() {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    authors: '',
    status: 'Presented'
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const studentId = user?.id || '1';
      const response = await fetchOrMock(`/api/papers?studentId=${studentId}`);
      const json = await response.json();
      if (json.success) {
        setPapers(Array.isArray(json.data) ? json.data : []);
      } else {
        setError(json.error || 'Failed to load papers');
      }
    } catch (err) {
      setError(err.message || 'Failed to load papers');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const stats = useMemo(() => ({
    total: papers.length,
    pending: papers.filter(item => (item.verificationStatus || 'Pending') === 'Pending').length,
    approved: papers.filter(item => item.verificationStatus === 'Approved').length,
    rejected: papers.filter(item => item.verificationStatus === 'Rejected').length
  }), [papers]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFile) {
      setError('Please upload presentation proof/certificate.');
      return;
    }

    try {
      setSubmitting(true);
      const fileData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      const payload = {
        studentId: user?.id || '1',
        studentName: user?.name || '',
        registerNumber: user?.rollNumber || '',
        department: user?.department || '',
        title: formData.title,
        name: formData.name,
        status: formData.status,
        authors: formData.authors.split(',').map(item => item.trim()).filter(Boolean),
        certificateFileName: selectedFile.name,
        certificateFileType: selectedFile.type,
        certificateFileData: fileData
      };

      const response = await fetchOrMock('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit paper details');
      }

      setSuccessMessage('Paper presentation details submitted for admin verification.');
      setSelectedFile(null);
      setFormData({ title: '', name: '', authors: '', status: 'Presented' });
      await fetchPapers();
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit paper details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="module-container"><p style={{textAlign:'center',color:'var(--muted)'}}>Loading papers...</p></div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FeatherIcon name="fileText" size={28} /> Paper Presentations</h2>
        <div className="module-stats">
          <span className="stat-item">Total: {stats.total}</span>
          <span className="stat-item">Pending: {stats.pending}</span>
          <span className="stat-item">Approved: {stats.approved}</span>
          <span className="stat-item">Rejected: {stats.rejected}</span>
        </div>
      </div>

      <div className="certificate-guidance">
        <p>Submit paper presentation/publication details with proof file. Admin will verify and approve or reject with remarks.</p>
      </div>

      <form className="certificate-form" onSubmit={handleSubmit}>
        <div className="certificate-form-grid">
          <div className="certificate-field">
            <label>Paper Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Conference / Journal</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Authors (comma-separated)</label>
            <input type="text" name="authors" value={formData.authors} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Status</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Upload Proof (PDF/Image)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} required />
            {selectedFile && <small>{selectedFile.name}</small>}
          </div>
        </div>

        {error && <p className="certificate-error">{error}</p>}
        {successMessage && <p className="certificate-success">{successMessage}</p>}

        <button type="submit" className="cert-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Paper Details'}
        </button>
      </form>

      <div className="module-grid">
        {papers.map((paper) => (
          <div key={paper._id || paper.id} className="module-card">
            <div className="card-icon"><FeatherIcon name="fileText" size={32} /></div>
            <div className="card-content">
              <h3>{paper.title}</h3>
              <p className="card-name"><FeatherIcon name="bookOpen" size={16} /> {paper.name}</p>
              <p className="card-description">{paper.description}</p>
              <p className="card-description">Authors: {Array.isArray(paper.authors) ? paper.authors.join(', ') : 'N/A'}</p>
              <p className="card-description">Proof File: {paper.certificateFileName || 'N/A'}</p>
              {paper.verificationStatus === 'Rejected' && paper.reviewRemarks && (
                <p className="certificate-reason"><FeatherIcon name="alertCircle" size={14} /> Remarks: {paper.reviewRemarks}</p>
              )}
              <div className="card-footer">
                <span className={`status-badge ${paper.status.toLowerCase()}`}>
                  {paper.status}
                </span>
                <span className={`status-badge ${String(paper.verificationStatus || 'Pending').toLowerCase()}`}>
                  Verify: {paper.verificationStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentPapers;
