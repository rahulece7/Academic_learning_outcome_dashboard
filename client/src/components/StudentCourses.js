import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './StudentModules.css';
import { useAuth } from '../context/AuthContext';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function StudentCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    progress: 100,
    status: 'Completed'
  });

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const studentId = user?.id || '1';
      const response = await fetchOrMock(`/api/courses?studentId=${studentId}`);
      const json = await response.json();
      if (json.success) {
        setCourses(Array.isArray(json.data) ? json.data : []);
      } else {
        setError(json.error || 'Failed to load courses');
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const stats = useMemo(() => ({
    total: courses.length,
    pending: courses.filter(item => (item.verificationStatus || 'Pending') === 'Pending').length,
    approved: courses.filter(item => item.verificationStatus === 'Approved').length,
    rejected: courses.filter(item => item.verificationStatus === 'Rejected').length
  }), [courses]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFile) {
      setError('Please upload the course completion certificate.');
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
        progress: Number(formData.progress) || 100,
        status: formData.status,
        certificateFileName: selectedFile.name,
        certificateFileType: selectedFile.type,
        certificateFileData: fileData
      };

      const response = await fetchOrMock('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit course details');
      }

      setSuccessMessage('Course details submitted for admin verification.');
      setSelectedFile(null);
      setFormData({ title: '', name: '', progress: 100, status: 'Completed' });
      await fetchCourses();
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit course details');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="module-container"><p style={{textAlign:'center',color:'var(--muted)'}}>Loading courses...</p></div>;

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FeatherIcon name="bookOpen" size={28} /> Online Courses</h2>
        <div className="module-stats">
          <span className="stat-item">Total: {stats.total}</span>
          <span className="stat-item">Pending: {stats.pending}</span>
          <span className="stat-item">Approved: {stats.approved}</span>
          <span className="stat-item">Rejected: {stats.rejected}</span>
        </div>
      </div>

      <div className="certificate-guidance">
        <p>Submit your online course details with certificate proof. Admin will verify the details and then approve or reject.</p>
      </div>

      <form className="certificate-form" onSubmit={handleSubmit}>
        <div className="certificate-form-grid">
          <div className="certificate-field">
            <label>Course Name</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Platform Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Progress (%)</label>
            <input type="number" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Status</label>
            <input type="text" name="status" value={formData.status} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Upload Certificate (PDF/Image)</label>
            <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} required />
            {selectedFile && <small>{selectedFile.name}</small>}
          </div>
        </div>

        {error && <p className="certificate-error">{error}</p>}
        {successMessage && <p className="certificate-success">{successMessage}</p>}

        <button type="submit" className="cert-btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Course Details'}
        </button>
      </form>

      <div className="module-grid">
        {courses.map((course) => (
          <div key={course._id || course.id} className="module-card">
            <div className="card-icon"><FeatherIcon name="bookOpen" size={32} /></div>
            <div className="card-content">
              <h3>{course.title}</h3>
              <p className="card-name"><FeatherIcon name="building" size={16} /> {course.name}</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${course.progress}%` }}></div>
              </div>
              <p className="progress-text">{course.progress}% Complete</p>
              <p className="card-description">Uploaded File: {course.certificateFileName || 'N/A'}</p>
              {course.verificationStatus === 'Rejected' && course.reviewRemarks && (
                <p className="certificate-reason"><FeatherIcon name="alertCircle" size={14} /> Remarks: {course.reviewRemarks}</p>
              )}
              <div className="card-footer">
                <span className={`status-badge ${course.status.toLowerCase().replace(' ', '-')}`}>
                  {course.status}
                </span>
                <span className={`status-badge ${String(course.verificationStatus || 'Pending').toLowerCase()}`}>
                  Verify: {course.verificationStatus || 'Pending'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentCourses;
