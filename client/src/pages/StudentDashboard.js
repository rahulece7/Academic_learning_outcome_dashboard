import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentSidebar from '../components/StudentSidebar';
import StudentProfile from '../components/StudentProfile';
import StudentCOPO from '../components/StudentCOPO';
import StudentProjects from '../components/StudentProjects';
import StudentInternships from '../components/StudentInternships';
import StudentCertifications from '../components/StudentCertifications';
import StudentCourses from '../components/StudentCourses';
import StudentPapers from '../components/StudentPapers';
import StudentAnnouncements from '../components/StudentAnnouncements';
import StudentVerificationSummary from '../components/StudentVerificationSummary';
import './StudentDashboard.css';
import '../styles/design-system.css';
import Button from '../components/ui/Button';
import FeatherIcon from '../components/FeatherIcon';
import { fetchOrMock } from '../utils/mockApi';

function StudentDashboard() {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState(user);
  const [activeModule, setActiveModule] = useState('profile');

  useEffect(() => {
    setStudentData(user);
  }, [user]);

  const fetchProfile = useCallback(async () => {
    try {
      const studentId = user?.id || '1';
      const response = await fetchOrMock(`/api/student/profile?studentId=${studentId}`);
      const json = await response.json();
      if (json.success && json.data) {
        setStudentData(json.data);
      }
    } catch (error) {
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    fetchProfile();
    const intervalId = setInterval(fetchProfile, 10000);
    const onFocus = () => fetchProfile();
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
    };
  }, [user?.id, fetchProfile]);

  const renderModule = () => {
    switch (activeModule) {
      case 'profile':
        return <StudentProfile user={studentData} />;
      case 'announcements':
        return <StudentAnnouncements />;
      case 'outcomes':
        return <StudentCOPO user={studentData} />;
      case 'projects':
        return <StudentProjects />;
      case 'internships':
        return <StudentInternships />;
      case 'certifications':
        return <StudentCertifications user={studentData} />;
      case 'verification':
        return <StudentVerificationSummary studentId={studentData?.id || user?.id} />;
      case 'courses':
        return <StudentCourses />;
      case 'papers':
        return <StudentPapers />;
      default:
        return <StudentProfile user={studentData} />;
    }
  };

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1><FeatherIcon name="bookOpen" size={28} /> Student Dashboard</h1>
          <p>Welcome, {studentData?.name}</p>
        </div>
          <div className="header-user ds-row" style={{gap:'12px'}}>
          <span className="user-info"><FeatherIcon name="userCircle" size={18} /> {studentData?.rollNumber}</span>
          <Button variant="ghost" onClick={logout}>Logout</Button>
        </div>
      </header>

      <div className="dashboard-container">
        <StudentSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="dashboard-content">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
