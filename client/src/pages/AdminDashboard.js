import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminSummary from '../components/AdminSummary';
import AdminStudentList from '../components/AdminStudentList';
import AdminCourseOutcomes from '../components/AdminCourseOutcomes';
import AdminAttendanceMonitoring from '../components/AdminAttendanceMonitoring';
import AdminResultsAnalysis from '../components/AdminResultsAnalysis';
import AdminInternshipsPlacement from '../components/AdminInternshipsPlacement';
import AdminAnnouncements from '../components/AdminAnnouncements';
import AdminAnalytics from '../components/AdminAnalytics';
import AdminCertificateSubmissions from '../components/AdminCertificateSubmissions';
import AdminSubmissionVerifications from '../components/AdminSubmissionVerifications';
import './AdminDashboard.css';
import '../styles/design-system.css';
import Button from '../components/ui/Button';
import FeatherIcon from '../components/FeatherIcon';
import Card from '../components/ui/Card';

function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="admin-dashboard app-shell">
      <div className="App-header">
        <div className="header-content">
          <h1>Admin Console</h1>
          <p className="muted">Manage students, view analytics and monitor system health.</p>
        </div>
        <div className="ds-row">
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </div>

      <main className="App-main">
        <div style={{display:'flex', gap:16, marginBottom:16, flexWrap:'wrap'}}>
          <Button variant={activeTab === 'summary' ? 'primary' : 'ghost'} onClick={() => setActiveTab('summary')}><FeatherIcon name="activity" size={16} /> Summary</Button>
          <Button variant={activeTab === 'students' ? 'primary' : 'ghost'} onClick={() => setActiveTab('students')}><FeatherIcon name="users" size={16} /> Students</Button>
          <Button variant={activeTab === 'outcomes' ? 'primary' : 'ghost'} onClick={() => setActiveTab('outcomes')}><FeatherIcon name="target" size={16} /> Outcomes</Button>
          <Button variant={activeTab === 'attendance' ? 'primary' : 'ghost'} onClick={() => setActiveTab('attendance')}><FeatherIcon name="calendar" size={16} /> Attendance</Button>
          <Button variant={activeTab === 'results' ? 'primary' : 'ghost'} onClick={() => setActiveTab('results')}><FeatherIcon name="barChart" size={16} /> Results</Button>
          <Button variant={activeTab === 'placements' ? 'primary' : 'ghost'} onClick={() => setActiveTab('placements')}><FeatherIcon name="briefcase" size={16} /> Placements</Button>
          <Button variant={activeTab === 'verifications' ? 'primary' : 'ghost'} onClick={() => setActiveTab('verifications')}><FeatherIcon name="checkCircle" size={16} /> Verifications</Button>
          <Button variant={activeTab === 'announcements' ? 'primary' : 'ghost'} onClick={() => setActiveTab('announcements')}><FeatherIcon name="bell" size={16} /> Announcements</Button>
          <Button variant={activeTab === 'certificates' ? 'primary' : 'ghost'} onClick={() => setActiveTab('certificates')}><FeatherIcon name="clipboard" size={16} /> Certificates</Button>
          <Button variant={activeTab === 'analytics' ? 'primary' : 'ghost'} onClick={() => setActiveTab('analytics')}><FeatherIcon name="pieChart" size={16} /> Analytics</Button>
        </div>

        <div className="ds-grid">
          <Card>
            {activeTab === 'summary' && <AdminSummary />}
            {activeTab === 'students' && <AdminStudentList />}
            {activeTab === 'outcomes' && <AdminCourseOutcomes />}
            {activeTab === 'attendance' && <AdminAttendanceMonitoring />}
            {activeTab === 'results' && <AdminResultsAnalysis />}
            {activeTab === 'placements' && <AdminInternshipsPlacement />}
            {activeTab === 'verifications' && <AdminSubmissionVerifications />}
            {activeTab === 'announcements' && <AdminAnnouncements />}
            {activeTab === 'certificates' && <AdminCertificateSubmissions />}
            {activeTab === 'analytics' && <AdminAnalytics />}
          </Card>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
