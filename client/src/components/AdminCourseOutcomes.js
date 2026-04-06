import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';
import { fetchOrMock } from '../utils/mockApi';

function AdminCourseOutcomes() {
  const fallbackRows = useMemo(
    () => [
      {
        id: 'm1',
        subject: 'Data Structures',
        internalMarks: 78,
        assignmentMarks: 82,
        assignmentTitle: 'Linked List Assignment',
        labCourse: 'Data Structures Lab',
        labExperiment: 'Stack and Queue Implementation'
      },
      {
        id: 'm2',
        subject: 'Database Management Systems',
        internalMarks: 84,
        assignmentMarks: 88,
        assignmentTitle: 'SQL Query Assignment',
        labCourse: 'DBMS Lab',
        labExperiment: 'Normalization and Joins'
      },
      {
        id: 'm3',
        subject: 'Operating Systems',
        internalMarks: 71,
        assignmentMarks: 74,
        assignmentTitle: 'Scheduling Assignment',
        labCourse: 'System Programming Lab',
        labExperiment: 'Process Synchronization'
      }
    ],
    []
  );

  const [rows, setRows] = useState(fallbackRows);
  const [activeView, setActiveView] = useState('course');
  const [savingId, setSavingId] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [createForm, setCreateForm] = useState({
    subject: 'Data Structures',
    internalMarks: '0',
    assignmentMarks: '0',
    assignmentTitle: 'General Assignment',
    labCourse: 'Data Structures Lab',
    labExperiment: 'Stack and Queue Implementation'
  });

  const tabs = [
    { id: 'course', label: 'Course', icon: 'bookOpen' },
    { id: 'lab', label: 'Lab', icon: 'database' },
    { id: 'assignment', label: 'Assignment', icon: 'clipboard' }
  ];

  const labCourseOptions = [
    'Data Structures Lab',
    'DBMS Lab',
    'System Programming Lab',
    'Computer Networks Lab',
    'Operating Systems Lab'
  ];

  const labExperimentOptions = [
    'Stack and Queue Implementation',
    'Normalization and Joins',
    'Process Synchronization',
    'Subnetting and Routing',
    'Deadlock Prevention'
  ];

  const subjectOptions = [
    'Data Structures',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering'
  ];

  const assignmentTitleOptions = [
    'Linked List Assignment',
    'SQL Query Assignment',
    'Scheduling Assignment',
    'Routing Assignment',
    'Design Patterns Assignment'
  ];

  const loadRows = useCallback(async () => {
    try {
      setError('');
      const response = await fetchOrMock('/api/outcomes');
      const json = await response.json();

      if (!json.success || !Array.isArray(json.data)) {
        setRows(fallbackRows);
        return;
      }

      const normalized = json.data.map((item, index) => ({
        id: item._id || item.id || `outcome-${index}`,
        subject: item.subject || item.title || `Subject ${index + 1}`,
        internalMarks: Number(item.internalMarks ?? item.progress ?? 0),
        assignmentMarks: Number(item.assignmentMarks ?? item.progress ?? 0),
        assignmentTitle: item.assignmentTitle || 'General Assignment',
        labCourse: item.labCourse || item.category || 'N/A',
        labExperiment: item.labExperiment || 'General Lab Experiment'
      }));

      setRows(normalized.length > 0 ? normalized : fallbackRows);
    } catch (err) {
      setError(err.message || 'Failed to load outcomes');
      setRows(fallbackRows);
    }
  }, [fallbackRows]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const updateLocalField = (id, key, value) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const saveRow = async (row) => {
    if (!row.subject.trim()) {
      setError('Subject is required');
      return;
    }

    try {
      setSavingId(row.id);
      setError('');
      setMessage('');

      const payload = {
        subject: row.subject.trim(),
        internalMarks: Number(row.internalMarks || 0),
        assignmentMarks: Number(row.assignmentMarks || 0),
        assignmentTitle: String(row.assignmentTitle || '').trim(),
        labCourse: String(row.labCourse || '').trim(),
        labExperiment: String(row.labExperiment || '').trim()
      };

      const response = await fetchOrMock(`/api/outcomes/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to save outcome');
      }

      setMessage('Outcome updated successfully');
      await loadRows();
    } catch (err) {
      setError(err.message || 'Failed to save outcome');
    } finally {
      setSavingId('');
    }
  };

  const addRow = async () => {
    if (!createForm.subject.trim()) {
      setError('Subject is required');
      return;
    }

    try {
      setIsAdding(true);
      setError('');
      setMessage('');

      const payload = {
        subject: createForm.subject.trim(),
        internalMarks: Number(createForm.internalMarks || 0),
        assignmentMarks: Number(createForm.assignmentMarks || 0),
        assignmentTitle: String(createForm.assignmentTitle || '').trim(),
        labCourse: String(createForm.labCourse || '').trim(),
        labExperiment: String(createForm.labExperiment || '').trim()
      };

      const response = await fetchOrMock('/api/outcomes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to add outcome');
      }

      setMessage(`${activeView.charAt(0).toUpperCase() + activeView.slice(1)} entry added successfully`);
      await loadRows();
    } catch (err) {
      setError(err.message || 'Failed to add outcome');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="target" size={28} /> Outcomes</h2>

      <div className="outcome-icon-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`outcome-tab-btn ${activeView === tab.id ? 'active' : ''}`}
            onClick={() => setActiveView(tab.id)}
          >
            <FeatherIcon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}
      {message && <p className="admin-success">{message}</p>}

      <div className="filter-row" style={{ marginBottom: 16 }}>
        {activeView === 'course' && (
          <>
            <div className="filter-group">
              <label>Subject</label>
              <select
                className="filter-select"
                value={createForm.subject}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, subject: event.target.value }))}
              >
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Internal Marks</label>
              <input
                className="filter-select"
                type="number"
                min="0"
                max="100"
                value={createForm.internalMarks}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, internalMarks: event.target.value }))}
              />
            </div>
            <div className="filter-group">
              <label>Subject Marks</label>
              <input
                className="filter-select"
                type="number"
                min="0"
                max="100"
                value={createForm.assignmentMarks}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, assignmentMarks: event.target.value }))}
              />
            </div>
            <button className="btn-secondary" onClick={addRow} disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add Course'}
            </button>
          </>
        )}

        {activeView === 'lab' && (
          <>
            <div className="filter-group">
              <label>Subject</label>
              <select
                className="filter-select"
                value={createForm.subject}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, subject: event.target.value }))}
              >
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Lab Course</label>
              <select
                className="filter-select"
                value={createForm.labCourse}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, labCourse: event.target.value }))}
              >
                {labCourseOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Experiment</label>
              <select
                className="filter-select"
                value={createForm.labExperiment}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, labExperiment: event.target.value }))}
              >
                {labExperimentOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <button className="btn-secondary" onClick={addRow} disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add Lab'}
            </button>
          </>
        )}

        {activeView === 'assignment' && (
          <>
            <div className="filter-group">
              <label>Subject</label>
              <select
                className="filter-select"
                value={createForm.subject}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, subject: event.target.value }))}
              >
                {subjectOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Assignment</label>
              <select
                className="filter-select"
                value={createForm.assignmentTitle}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, assignmentTitle: event.target.value }))}
              >
                {assignmentTitleOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Assignment Marks</label>
              <input
                className="filter-select"
                type="number"
                min="0"
                max="100"
                value={createForm.assignmentMarks}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, assignmentMarks: event.target.value }))}
              />
            </div>
            <button className="btn-secondary" onClick={addRow} disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add Assignment'}
            </button>
          </>
        )}
      </div>

      <div className="student-table-container">
        <table className="student-table">
          <thead>
            {activeView === 'course' && (
              <tr>
                <th>Subject</th>
                <th>Internal Marks</th>
                <th>Subject Marks</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            )}
            {activeView === 'lab' && (
              <tr>
                <th>Subject</th>
                <th>Lab Course</th>
                <th>Experiment</th>
                <th>Actions</th>
              </tr>
            )}
            {activeView === 'assignment' && (
              <tr>
                <th>Subject</th>
                <th>Assignment</th>
                <th>Assignment Marks</th>
                <th>Actions</th>
              </tr>
            )}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {activeView === 'course' && (
                  <>
                    <td>
                      <input
                        className="filter-select"
                        value={row.subject}
                        onChange={(event) => updateLocalField(row.id, 'subject', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="filter-select"
                        type="number"
                        min="0"
                        max="100"
                        value={row.internalMarks}
                        onChange={(event) => updateLocalField(row.id, 'internalMarks', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="filter-select"
                        type="number"
                        min="0"
                        max="100"
                        value={row.assignmentMarks}
                        onChange={(event) => updateLocalField(row.id, 'assignmentMarks', event.target.value)}
                      />
                    </td>
                    <td>{Number(row.internalMarks) + Number(row.assignmentMarks)}</td>
                    <td>
                      <button className="btn-secondary" onClick={() => saveRow(row)} disabled={savingId === row.id}>
                        {savingId === row.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </>
                )}
                {activeView === 'lab' && (
                  <>
                    <td>
                      <input
                        className="filter-select"
                        value={row.subject}
                        onChange={(event) => updateLocalField(row.id, 'subject', event.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        className="filter-select"
                        value={row.labCourse}
                        onChange={(event) => updateLocalField(row.id, 'labCourse', event.target.value)}
                      >
                        {!labCourseOptions.includes(row.labCourse) && <option value={row.labCourse}>{row.labCourse}</option>}
                        {labCourseOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="filter-select"
                        value={row.labExperiment}
                        onChange={(event) => updateLocalField(row.id, 'labExperiment', event.target.value)}
                      >
                        {!labExperimentOptions.includes(row.labExperiment) && <option value={row.labExperiment}>{row.labExperiment}</option>}
                        {labExperimentOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button className="btn-secondary" onClick={() => saveRow(row)} disabled={savingId === row.id}>
                        {savingId === row.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </>
                )}
                {activeView === 'assignment' && (
                  <>
                    <td>
                      <input
                        className="filter-select"
                        value={row.subject}
                        onChange={(event) => updateLocalField(row.id, 'subject', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="filter-select"
                        value={row.assignmentTitle}
                        onChange={(event) => updateLocalField(row.id, 'assignmentTitle', event.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="filter-select"
                        type="number"
                        min="0"
                        max="100"
                        value={row.assignmentMarks}
                        onChange={(event) => updateLocalField(row.id, 'assignmentMarks', event.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btn-secondary" onClick={() => saveRow(row)} disabled={savingId === row.id}>
                        {savingId === row.id ? 'Saving...' : 'Save'}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default AdminCourseOutcomes;
