import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminFacultyManagement() {
  const faculty = [
    { name: 'Dr. Rajesh Kumar', department: 'Computer Science', subjects: 'Data Structures', workload: 16, rating: 4.5 },
    { name: 'Prof. Priya Singh', department: 'Computer Science', subjects: 'DBMS', workload: 14, rating: 4.7 },
    { name: 'Dr. Kiran Patel', department: 'Electronics', subjects: 'Signals', workload: 18, rating: 4.2 }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="users" size={28} /> Faculty Management</h2>

      <div className="filter-row">
        <div className="filter-group">
          <label>Department</label>
          <select className="filter-select" defaultValue="all">
            <option value="all">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>
        <button className="btn-secondary">Assign Subjects</button>
        <button className="btn-secondary">Generate Report</button>
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Subjects</th>
              <th>Workload</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {faculty.map((f, idx) => (
              <tr key={idx}>
                <td>{f.name}</td>
                <td>{f.department}</td>
                <td>{f.subjects}</td>
                <td>{f.workload} hrs/week</td>
                <td>
                  <span className="rating-badge">{f.rating}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default AdminFacultyManagement;
