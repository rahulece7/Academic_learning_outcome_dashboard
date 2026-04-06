import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './StudentModules.css';
import { useAuth } from '../context/AuthContext';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function StudentProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    description: '',
    technologies: '',
    status: 'In Progress'
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const studentId = user?.id || '1';
      const response = await fetchOrMock(`/api/projects?studentId=${studentId}`);
      const json = await response.json();
      if (json.success) {
        setProjects(Array.isArray(json.data) ? json.data : []);
      } else {
        setError(json.error || 'Failed to load projects');
      }
    } catch (err) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-use-before-define
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const stats = useMemo(() => ({
    total: projects.length,
    pending: projects.filter(item => (item.verificationStatus || 'Pending') === 'Pending').length,
    approved: projects.filter(item => item.verificationStatus === 'Approved').length,
    rejected: projects.filter(item => item.verificationStatus === 'Rejected').length
  }), [projects]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFile) {
      setError('Please upload project proof file.');
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
        description: formData.description,
        technologies: formData.technologies.split(',').map(item => item.trim()).filter(Boolean),
        status: formData.status,
        certificateFileName: selectedFile.name,
        certificateFileType: selectedFile.type,
        certificateFileData: fileData
      };

      const response = await fetchOrMock('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit project details');
      }

      setSuccessMessage('Project details submitted for admin verification.');
      setSelectedFile(null);
      setFormData({ title: '', name: '', description: '', technologies: '', status: 'In Progress' });
      await fetchProjects();
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit project details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="module-container"><p style={{textAlign:'center',color:'var(--muted)'}}>Loading projects...</p></div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FeatherIcon name="folder" size={28} /> Your Projects</h2>
        <div className="module-stats">
          <span className="stat-item">Total: {stats.total}</span>
          <span className="stat-item">Pending: {stats.pending}</span>
          <span className="stat-item">Approved: {stats.approved}</span>
          <span className="stat-item">Rejected: {stats.rejected}</span>
        </div>
      </div>

      <div className="certificate-guidance">
        <p>Upload your project details and proof file. Admin will verify and then approve or reject your project submission.</p>
      </div>

      <form className="certificate-form" onSubmit={handleSubmit}>
        <div className="certificate-form-grid">
          <div className="certificate-field">
            <label>Project Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Team / Organization</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Status</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Technologies (comma-separated)</label>
            <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} />
          </div>
          <div className="certificate-field" style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} required />
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
          {submitting ? 'Submitting...' : 'Submit Project'}
        </button>
      </form>

      <div className="module-grid">
        {projects.map((project) => (
          <div key={project._id || project.id} className="module-card">
            <div className="card-icon"><FeatherIcon name="folder" size={32} /></div>
            <div className="card-content">
              <h3>{project.title}</h3>
              <p className="card-name"><FeatherIcon name="users" size={16} /> {project.name}</p>
              <p className="card-description">{project.description}</p>
              <p className="card-description">Technologies: {Array.isArray(project.technologies) ? project.technologies.join(', ') : 'N/A'}</p>
              <p className="card-description">Proof File: {project.certificateFileName || 'N/A'}</p>
              {project.verificationStatus === 'Rejected' && project.reviewRemarks && (
                <p className="certificate-reason"><FeatherIcon name="alertCircle" size={14} /> Remarks: {project.reviewRemarks}</p>
              )}
              <div className="card-footer">
                <span className={`status-badge ${project.status.toLowerCase().replace(' ', '-')}`}>
                  {project.status}
                </span>
                <span className={`status-badge ${String(project.verificationStatus || 'Pending').toLowerCase()}`}>
                  Verify: {project.verificationStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentProjects;
