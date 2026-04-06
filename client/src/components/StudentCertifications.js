import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';
import { fetchOrMock } from '../utils/mockApi';

function StudentCertifications() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    registerNumber: user?.rollNumber || '',
    department: user?.department || '',
    courseName: '',
    platformName: '',
    courseDuration: '',
    completionDate: '',
    certificateId: ''
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      studentName: user?.name || prev.studentName,
      registerNumber: user?.rollNumber || prev.registerNumber,
      department: user?.department || prev.department
    }));
  }, [user]);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const studentId = user?.id || '1';
      const response = await fetchOrMock(`/api/certifications?studentId=${studentId}`);
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error || 'Failed to fetch certificate submissions');
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
  }, [user]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const stats = useMemo(() => {
    return {
      total: submissions.length,
      pending: submissions.filter((item) => item.status === 'Pending').length,
      approved: submissions.filter((item) => item.status === 'Approved').length,
      rejected: submissions.filter((item) => item.status === 'Rejected').length
    };
  }, [submissions]);

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    return new Date(dateValue).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError('Please upload a valid PDF or image file.');
      setSelectedFile(null);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!selectedFile) {
      setError('Certificate file is required.');
      return;
    }

    try {
      setSubmitting(true);
      const fileData = await toBase64(selectedFile);
      const payload = {
        studentId: user?.id || '1',
        studentName: formData.studentName,
        registerNumber: formData.registerNumber,
        department: formData.department,
        courseName: formData.courseName,
        platformName: formData.platformName,
        courseDuration: formData.courseDuration,
        completionDate: formData.completionDate,
        certificateId: formData.certificateId,
        certificateFileName: selectedFile.name,
        certificateFileType: selectedFile.type,
        certificateFileData: fileData
      };

      const response = await fetchOrMock('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit certificate');
      }

      setSuccessMessage('Certificate uploaded successfully. Current status: Pending.');
      setFormData((prev) => ({
        ...prev,
        courseName: '',
        platformName: '',
        courseDuration: '',
        completionDate: '',
        certificateId: ''
      }));
      setSelectedFile(null);
      await fetchSubmissions();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="module-container">
      <div className="module-header">
        <h2><FeatherIcon name="award" size={24} /> Online Course Certificate Upload & Status</h2>
        <div className="module-stats">
          <span className="stat-item">Total: {stats.total}</span>
          <span className="stat-item">Pending: {stats.pending}</span>
          <span className="stat-item">Approved: {stats.approved}</span>
          <span className="stat-item">Rejected: {stats.rejected}</span>
        </div>
      </div>

      <div className="certificate-guidance">
        <p>Upload your online course certificate as proof of completion. After submission, status will be <strong>Pending</strong> until admin/faculty verification.</p>
        <p>If rejected, review admin remarks, correct details, and resubmit with a clear valid certificate.</p>
      </div>

      <form className="certificate-form" onSubmit={handleSubmit}>
        <div className="certificate-form-grid">
          <div className="certificate-field">
            <label>Student Name</label>
            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Register Number</label>
            <input type="text" name="registerNumber" value={formData.registerNumber} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Course Name</label>
            <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Platform Name</label>
            <input type="text" name="platformName" value={formData.platformName} onChange={handleChange} placeholder="e.g., Coursera / NPTEL / Udemy" required />
          </div>
          <div className="certificate-field">
            <label>Course Duration</label>
            <input type="text" name="courseDuration" value={formData.courseDuration} onChange={handleChange} placeholder="e.g., 6 weeks" required />
          </div>
          <div className="certificate-field">
            <label>Completion Date</label>
            <input type="date" name="completionDate" value={formData.completionDate} onChange={handleChange} required />
          </div>
          <div className="certificate-field">
            <label>Certificate ID (if available)</label>
            <input type="text" name="certificateId" value={formData.certificateId} onChange={handleChange} />
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
          {submitting ? 'Uploading...' : 'Upload Course Certificate'}
        </button>
      </form>

      <div className="module-section">
        <h3><FeatherIcon name="list" size={18} /> Submitted Certificates</h3>
        {loading ? (
          <p className="cert-loading">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <p className="cert-loading">No certificate submissions yet.</p>
        ) : (
          <div className="module-grid">
            {submissions.map((item) => (
              <div key={item.id || item._id} className="module-card">
                <div className="card-content">
                  <h3>{item.courseName}</h3>
                  <p className="card-name"><FeatherIcon name="building" size={16} /> Platform: {item.platformName}</p>
                  <p className="card-description">Course Duration: {item.courseDuration}</p>
                  <p className="card-description">Completion Date: {formatDate(item.completionDate)}</p>
                  <p className="card-description">Certificate ID: {item.certificateId || 'N/A'}</p>
                  <p className="card-description">File: {item.certificateFileName || 'N/A'}</p>
                  {item.status === 'Rejected' && item.adminRemarks && (
                    <p className="certificate-reason">
                      <FeatherIcon name="alertCircle" size={14} /> Admin Remarks: {item.adminRemarks}
                    </p>
                  )}
                  <div className="card-footer">
                    <span className={`status-badge ${String(item.status).toLowerCase()}`}>
                      {item.status}
                    </span>
                    <span className="card-date"><FeatherIcon name="calendar" size={14} /> Submitted: {formatDate(item.submittedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCertifications;
