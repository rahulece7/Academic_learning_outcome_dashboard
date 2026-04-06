import React, { useState, useEffect } from 'react';
import './OutcomeForm.css';

function OutcomeForm({ onSubmit, onCancel, initialData, isEditing }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    status: 'Not Started',
    progress: 0
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'progress' ? parseInt(value, 10) : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      setFormData({
        title: '',
        description: '',
        category: 'General',
        status: 'Not Started',
        progress: 0
      });
    }
  };

  return (
    <div className="outcome-form-container">
      <div className="outcome-form">
        <h2>{isEditing ? 'Edit Learning Outcome' : 'Add New Learning Outcome'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Critical Thinking"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what students should be able to do..."
              rows="4"
              className={errors.description ? 'error' : ''}
            ></textarea>
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>General</option>
                <option>Cognitive Skills</option>
                <option>Soft Skills</option>
                <option>Technical Skills</option>
                <option>Collaboration</option>
                <option>Communication</option>
                <option>Problem Solving</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="progress">Progress: {formData.progress}%</label>
            <input
              id="progress"
              type="range"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              className={errors.progress ? 'error' : ''}
            />
            {errors.progress && <span className="error-text">{errors.progress}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-success">
              {isEditing ? '💾 Update Outcome' : '➕ Add Outcome'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OutcomeForm;
