import React from 'react';
import './AdminComponents.css';
import FeatherIcon from './FeatherIcon';
import Card from './ui/Card';

function AdminAttendanceMonitoring() {
  const departmentShortage = [
    { department: 'Electronics', shortage: 18 },
    { department: 'Mechanical', shortage: 12 },
    { department: 'Civil', shortage: 8 }
  ];

  const defaulters = [
    { name: 'Aakash Verma', roll: 'E201', attendance: 62 },
    { name: 'Neha Gupta', roll: 'M114', attendance: 64 },
    { name: 'Rohan Das', roll: 'C312', attendance: 66 }
  ];

  return (
    <Card className="admin-section">
      <h2><FeatherIcon name="calendar" size={28} /> Attendance Monitoring</h2>

      <div className="admin-grid-two">
        <div className="admin-card">
          <h3><FeatherIcon name="barChart2" size={18} /> Department-wise Shortage</h3>
          <ul className="simple-list">
            {departmentShortage.map((d, idx) => (
              <li key={idx}>
                <span>{d.department}</span>
                <span className="chip warn">{d.shortage}% below</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="admin-card">
          <h3><FeatherIcon name="userX" size={18} /> Defaulters List</h3>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {defaulters.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.name}</td>
                    <td>{s.roll}</td>
                    <td><span className="chip danger">{s.attendance}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AdminAttendanceMonitoring;
