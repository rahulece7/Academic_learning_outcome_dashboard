import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './StudentModules.css';
import { useAuth } from '../context/AuthContext';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function StudentInternships() {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    duration: '',
    mentor: '',
    status: 'Completed'
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchInternships = useCallback(async () => {
    try {
      setLoading(true);
      const studentId = user?.id || '1';
      const response = await fetchOrMock(`/api/internships?studentId=${studentId}`);
      const json = await response.json();
      if (json.success) {
        setInternships(Array.isArray(json.data) ? json.data : []);
      } else {
        setError(json.error || 'Failed to load internships');
      }
    } catch (err) {
      setError(err.message || 'Failed to load internships');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  const stats = useMemo(() => ({
    total: internships.length,
    pending: internships.filter(item => (item.verificationStatus || 'Pending') === 'Pending').length,
    approved: internships.filter(item => item.verificationStatus === 'Approved').length,
    rejected: internships.filter(item => item.verificationStatus === 'Rejected').length
  }), [internships]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFile) {
      setError('Please upload internship proof/certificate.');
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
        duration: formData.duration,
        mentor: formData.mentor,
        status: formData.status,
        certificateFileName: selectedFile.name,
        certificateFileType: selectedFile.type,
        certificateFileData: fileData
      };

      const response = await fetchOrMock('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit internship details');
      }

      setSuccessMessage('Internship details submitted for admin verification.');
      setSelectedFile(null);
      setFormData({ title: '', name: '', duration: '', mentor: '', status: 'Completed' });
      await fetchInternships();
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit internship details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="module-container"><p style={{textAlign:'center',color:'var(--muted)'}}>Loading internships...</p></div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FeatherIcon name="briefcase" size={28} /> Internships</h2>
        <div className="module-stats">
          <span className="stat-item">Total: {stats.total}</span>
          <span className="stat-item">Pending: {stats.pending}</span>
          <span className="stat-item">Approved: {stats.approved}</span>
          <span className="stat-item">Rejected: {stats.rejected}</span>
        </div>
      </div>

      <div className="certificate-guidance">
        <p>Submit internship details with proof file. Admin can verify details and mark Approved or Rejected.</p>
      </div>

      <form className="certificate-form" onSubmit={handleSubmit}>
        <div className="certificate-form-grid">
          <div className="certificate-field">
            <label>Internship Role</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Company Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Duration</label>
            <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Mentor</label>
            <input type="text" name="mentor" value={formData.mentor} onChange={handleChange} />
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
          {submitting ? 'Submitting...' : 'Submit Internship Details'}
        </button>
      </form>

      <div className="module-grid">
        {internships.map((internship) => (
          <div key={internship._id || internship.id} className="module-card">
            <div className="card-icon"><FeatherIcon name="briefcase" size={32} /></div>
            <div className="card-content">
              <h3>{internship.title}</h3>
              <p className="card-name"><FeatherIcon name="building" size={16} /> {internship.name}</p>
              <p className="card-description">Duration: {internship.duration}</p>
              <p className="card-description">Mode: {internship.mode || 'N/A'}</p>
              <p className="card-description">Proof File: {internship.certificateFileName || 'N/A'}</p>
              {internship.verificationStatus === 'Rejected' && internship.reviewRemarks && (
                <p className="certificate-reason"><FeatherIcon name="alertCircle" size={14} /> Remarks: {internship.reviewRemarks}</p>
              )}
              <div className="card-footer">
                <span className={`status-badge ${internship.status.toLowerCase().replace(' ', '-')}`}>
                  {internship.status}
                </span>
                <span className={`status-badge ${String(internship.verificationStatus || 'Pending').toLowerCase()}`}>
                  Verify: {internship.verificationStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentInternships;
