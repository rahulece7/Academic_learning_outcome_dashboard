import React, { useState, useEffect } from 'react';
import './AdminComponents.css';
import Card from './ui/Card';
import FeatherIcon from './FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function AdminStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formMode, setFormMode] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    loginId: '',
    password: '',
    rollNumber: '',
    email: '',
    department: 'Computer Science',
    year: '1',
    semester: '1',
    cgpa: '',
    sgpa: '',
    attendance: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetchOrMock('/api/admin/students');
      const json = await response.json();
      if (json.success) {
        setStudents(json.data || []);
      } else {
        setError(json.error || 'Failed to load students');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormMode(null);
    setFormData({
      id: '',
      name: '',
      loginId: '',
      password: '',
      rollNumber: '',
      email: '',
      department: 'Computer Science',
      year: '1',
      semester: '1',
      cgpa: '',
      sgpa: '',
      attendance: '',
      status: 'Active'
    });
  };

  const handleAdd = () => {
    setError(null);
    setFormMode('add');
    setFormData({
      id: '',
      name: '',
      loginId: '',
      password: '',
      rollNumber: '',
      email: '',
      department: 'Computer Science',
      year: '1',
      semester: '1',
      cgpa: '',
      sgpa: '',
      attendance: '',
      status: 'Active'
    });
  };

  const handleEdit = (student) => {
    setError(null);
    setFormMode('edit');
    setFormData({
      id: student.id || student._id,
      name: student.name || '',
      loginId: student.loginId || '',
      password: '',
      rollNumber: student.rollNumber || '',
      email: student.email || '',
      department: student.department || 'Computer Science',
      year: String(student.year ?? '1'),
      semester: String(student.semester ?? '1'),
      cgpa: student.cgpa ?? '',
      sgpa: student.sgpa ?? '',
      attendance: student.attendance ?? '',
      status: student.status || 'Active'
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.rollNumber || !formData.email || !formData.department) {
      setError('Name, roll number, email and department are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name,
        rollNumber: formData.rollNumber,
        email: formData.email,
        department: formData.department,
        year: Number(formData.year),
        semester: Number(formData.semester),
        cgpa: formData.cgpa === '' ? 0 : Number(formData.cgpa),
        sgpa: formData.sgpa === '' ? 0 : Number(formData.sgpa),
        attendance: formData.attendance === '' ? 0 : Number(formData.attendance),
        status: formData.status
      };

      const url = formMode === 'edit' ? `/api/admin/students/${formData.id}` : '/api/admin/students';
      const method = formMode === 'edit' ? 'PUT' : 'POST';

      const response = await fetchOrMock(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || `Failed to ${formMode === 'edit' ? 'update' : 'create'} student`);
      }

      if (!formData.loginId || !formData.password) {
        throw new Error('Login ID and password are required and editable only by faculty/admin.');
      }

      const targetId = formMode === 'edit' ? formData.id : (json.data?.id || json.data?._id);
      const credResponse = await fetchOrMock(`/api/admin/students/${targetId}/credentials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          loginId: formData.loginId,
          password: formData.password
        })
      });

      const credJson = await credResponse.json();
      if (!credResponse.ok || !credJson.success) {
        throw new Error(credJson.error || 'Failed to update login credentials');
      }

      resetForm();
      await fetchStudents();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    const studentId = student.id || student._id;
    if (!studentId) return;
    if (!window.confirm(`Delete ${student.name}?`)) return;

    try {
      setError(null);
      const response = await fetchOrMock(`/api/admin/students/${studentId}`, { method: 'DELETE' });
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to delete student');
      }
      await fetchStudents();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (loading) return <Card className="admin-section"><p style={{textAlign:'center',color:'var(--muted)'}}>Loading students...</p></Card>;
  if (error) return <Card className="admin-section"><p style={{textAlign:'center',color:'#e74c3c'}}>Error: {error}</p></Card>;

  return (
    <Card className="admin-section">
      <div className="section-header">
        <div>
          <h2><FeatherIcon name="users" size={28} /> Faculty Student Profile Management</h2>
          <div className="section-stats">
            <span className="stat">Total Students: {students.length}</span>
            <span className="stat">Active: {students.filter(s => s.status === 'Active').length}</span>
          </div>
        </div>
        <div className="section-actions">
          <button className="btn-secondary" onClick={handleAdd}>
            <FeatherIcon name="plus" size={16} /> Add Student
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {formMode && (
        <form className="admin-card" onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
          <h3>
            <FeatherIcon name="edit2" size={16} /> {formMode === 'add' ? 'Add Student Profile' : 'Edit Student Profile'}
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Login ID (Faculty Editable)</label>
              <input className="form-input" name="loginId" value={formData.loginId} onChange={handleChange} placeholder="e.g. std001" required />
            </div>
            <div className="form-group">
              <label>Password (Faculty Editable)</label>
              <input className="form-input" type="text" name="password" value={formData.password} onChange={handleChange} placeholder="Enter password" required />
            </div>
            <div className="form-group">
              <label>Roll Number</label>
              <input className="form-input" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Department</label>
              <select className="form-input" name="department" value={formData.department} onChange={handleChange}>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
            <div className="form-group">
              <label>Year</label>
              <input className="form-input" type="number" min="1" max="4" name="year" value={formData.year} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Semester</label>
              <input className="form-input" type="number" min="1" max="8" name="semester" value={formData.semester} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>CGPA</label>
              <input className="form-input" type="number" min="0" max="10" step="0.1" name="cgpa" value={formData.cgpa} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>SGPA</label>
              <input className="form-input" type="number" min="0" max="10" step="0.1" name="sgpa" value={formData.sgpa} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Attendance (%)</label>
              <input className="form-input" type="number" min="0" max="100" name="attendance" value={formData.attendance} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select className="form-input" name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="section-actions" style={{ marginTop: 12 }}>
            <button type="submit" className="btn-secondary" disabled={saving}>
              {saving ? 'Saving...' : formMode === 'add' ? 'Create Student' : 'Update Student'}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Login ID</th>
              <th>Roll No.</th>
              <th>Department</th>
              <th>Email</th>
              <th>CGPA</th>
              <th>Attendance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id || student._id}>
                <td>{student.name}</td>
                <td>{student.loginId || 'N/A'}</td>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.email}</td>
                <td><span className="cgpa-badge">{student.cgpa}</span></td>
                <td><div className="attendance-bar">
                      <div className="attendance-fill" style={{ width: `${student.attendance}%` }}></div>
                      <span className="attendance-text">{student.attendance}%</span>
                    </div></td>
                <td><span className="status-badge active">{student.status}</span></td>
                <td>
                  <button 
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(student)}
                    title="Edit student"
                  >
                    <FeatherIcon name="edit2" size={16} color="#4299e1" />
                  </button>
                  <button 
                    className="btn-action btn-view"
                    title="View details"
                    onClick={() => handleEdit(student)}
                  >
                    <FeatherIcon name="eye" size={16} color="#48bb78" />
                  </button>
                  <button 
                    className="btn-action btn-delete"
                    title="Delete student"
                    onClick={() => handleDelete(student)}
                  >
                    <FeatherIcon name="trash2" size={16} color="#ef4444" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default AdminStudentList;
