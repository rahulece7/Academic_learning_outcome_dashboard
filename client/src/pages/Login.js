import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FeatherIcon from '../components/FeatherIcon';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState('student'); // 'student' or 'admin'
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // For admin require email, for student allow login ID / roll number / email
    if (!email.trim()) {
      newErrors.email = userRole === 'admin' ? 'Username is required' : 'Login ID is required';
    } else if (userRole === 'admin' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      const result = await login(email, password, userRole);
      if (result.success) {
        const dashboardUrl = userRole === 'admin' ? '/admin-dashboard' : '/student-dashboard';
        navigate(dashboardUrl);
      } else {
        setSubmitError(result.error || 'Invalid credentials');
      }
    } catch (error) {
      setSubmitError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <h1><FeatherIcon name="bookOpen" size={28} /> Academic Dashboard</h1>
            <p>Learning Outcome Tracker</p>
          </div>

          {submitError && (
            <div className="error-message">{submitError}</div>
          )}

          {/* Role Selection */}
          <div className="role-selection">
            <label>Login As</label>
            <div className="role-buttons">
              <button
                type="button"
                className={`role-btn ${userRole === 'student' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('student');
                  setSubmitError('');
                }}
              >
                <FeatherIcon name="userCircle" size={16} /> Student
              </button>
              <button
                type="button"
                className={`role-btn ${userRole === 'admin' ? 'active' : ''}`}
                onClick={() => {
                  setUserRole('admin');
                  setSubmitError('');
                }}
              >
                <FeatherIcon name="users" size={16} /> Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">{userRole === 'admin' ? 'Username' : 'Login ID'}</label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder={userRole === 'student' ? 'e.g. std001 / A101' : 'admin@example.com'}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="show-password"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label="Toggle password visibility"
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <FeatherIcon name={showPassword ? 'eye' : 'eye'} size={18} />
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
              <div style={{ marginTop: 8 }}><a href="/forgot-password" className="forgot-link">Forgot password?</a></div>
            </div>

            <button 
              type="submit" 
              className="btn btn-login"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>© 2026 Academic Learning Outcome Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
