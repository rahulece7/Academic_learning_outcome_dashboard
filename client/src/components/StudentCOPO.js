import React, { useEffect, useMemo, useState } from 'react';
import FeatherIcon from './FeatherIcon';
import './StudentModules.css';
import { fetchOrMock } from '../utils/mockApi';

function StudentCOPO({ user }) {
  const fallbackData = useMemo(
    () => [
      {
        id: 'm1',
        subject: 'Data Structures',
        assignmentMarks: 82,
        assignmentTitle: 'Linked List Assignment',
        internalMarks: 78,
        labCourse: 'Data Structures Lab',
        labExperiment: 'Stack and Queue Implementation'
      },
      {
        id: 'm2',
        subject: 'Database Management Systems',
        assignmentMarks: 88,
        assignmentTitle: 'SQL Query Assignment',
        internalMarks: 84,
        labCourse: 'DBMS Lab',
        labExperiment: 'Normalization and Joins'
      },
      {
        id: 'm3',
        subject: 'Operating Systems',
        assignmentMarks: 74,
        assignmentTitle: 'Scheduling Assignment',
        internalMarks: 71,
        labCourse: 'System Programming Lab',
        labExperiment: 'Process Synchronization'
      }
    ],
    []
  );

  const [marksData, setMarksData] = useState(fallbackData);
  const [activeView, setActiveView] = useState('course');
  const [error, setError] = useState('');

  const tabs = [
    { id: 'course', label: 'Course', icon: 'bookOpen' },
    { id: 'lab', label: 'Lab', icon: 'database' },
    { id: 'assignment', label: 'Assignment', icon: 'clipboard' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('');
        const response = await fetchOrMock('/api/outcomes');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          const normalized = data.data.map((item, index) => ({
            id: item._id || item.id || `outcome-${index}`,
            subject: item.subject || item.title || `Subject ${index + 1}`,
            assignmentMarks: Number(item.assignmentMarks ?? item.progress ?? 0),
            assignmentTitle: item.assignmentTitle || 'General Assignment',
            internalMarks: Number(item.internalMarks ?? item.progress ?? 0),
            labCourse: item.labCourse || item.category || 'N/A',
            labExperiment: item.labExperiment || 'General Lab Experiment'
          }));
          setMarksData(normalized.length > 0 ? normalized : fallbackData);
          return;
        }
        setMarksData(fallbackData);
      } catch (err) {
        setError(err.message || 'Failed to load marks data');
        setMarksData(fallbackData);
      }
    };

    loadData();
  }, [fallbackData, user?.department, user?.semester]);

  return (
    <div className="student-module">
      <div className="module-header">
        <div>
          <h2><FeatherIcon name="target" size={24} /> Outcome</h2>
          <p>Assignment, internal and lab course marks</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-info">
          <FeatherIcon name="info" size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="student-outcome-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`student-outcome-tab-btn ${activeView === tab.id ? 'active' : ''}`}
            onClick={() => setActiveView(tab.id)}
          >
            <FeatherIcon name={tab.icon} size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="module-section">
        <h3><FeatherIcon name="bookOpen" size={18} /> Outcome Details</h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              {activeView === 'course' && (
                <tr>
                  <th>Subject</th>
                  <th>Internal Marks</th>
                  <th>Subject Marks</th>
                  <th>Total</th>
                </tr>
              )}
              {activeView === 'lab' && (
                <tr>
                  <th>Subject</th>
                  <th>Lab Course</th>
                  <th>Experiment</th>
                </tr>
              )}
              {activeView === 'assignment' && (
                <tr>
                  <th>Subject</th>
                  <th>Assignment</th>
                  <th>Assignment Marks</th>
                </tr>
              )}
            </thead>
            <tbody>
              {marksData.map((row) => (
                <tr key={row.id}>
                  {activeView === 'course' && (
                    <>
                      <td>{row.subject}</td>
                      <td>{row.internalMarks}</td>
                      <td>{row.assignmentMarks}</td>
                      <td>{Number(row.internalMarks || 0) + Number(row.assignmentMarks || 0)}</td>
                    </>
                  )}
                  {activeView === 'lab' && (
                    <>
                      <td>{row.subject}</td>
                      <td>{row.labCourse}</td>
                      <td>{row.labExperiment}</td>
                    </>
                  )}
                  {activeView === 'assignment' && (
                    <>
                      <td>{row.subject}</td>
                      <td>{row.assignmentTitle}</td>
                      <td>{row.assignmentMarks}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default StudentCOPO;
