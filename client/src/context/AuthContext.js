import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
                  setUser(JSON.parse(storedUser));
          }
          setLoading(false);
    }, []);

    const login = async (email, password, role = 'student') => {
          try {
                  setLoading(true);

            const shouldUseMock = process.env.REACT_APP_FORCE_MOCK === 'true';
                  if (shouldUseMock) {
                            // Bypass the live network!
                    if (role === 'admin' && email === 'admin@example.com' && password === 'admin123') {
                                const userData = { id: 'admin1', email, name: 'Admin User', role: 'admin', loginTime: new Date().toISOString() };
                                setUser(userData);
                                localStorage.setItem('user', JSON.stringify(userData));
                                return { success: true };
                    } else if (role === 'student' && password === 'pass001') {
                                const userData = { id: '1', loginId: 'std001', email, name: 'Arjun Sharma', role: 'student', department: 'Computer Science', loginTime: new Date().toISOString() };
                                setUser(userData);
                                localStorage.setItem('user', JSON.stringify(userData));
                                return { success: true };
                    }
                            return { success: false, error: 'Invalid mock credentials' };
                  }

            const API_URL = process.env.REACT_APP_API_URL || '';
                  const response = await fetch(`${API_URL}/api/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, password, userRole: role })
                  });

            const data = await response.json();
                  if (!response.ok || !data.success) {
                            return { success: false, error: data.error || 'Login failed' };
                  }

            const userData = { ...data.user, loginTime: new Date().toISOString() };
                  setUser(userData);
                       localStorage.setItem('user', JSON.stringify(userData));
                  return { success: true };
          } catch (error) {
                  return { success: false, error: error.message };
          } finally {
                  setLoading(false);
          }
    };

    const logout = () => {
          setUser(null);
          localStorage.removeItem('user');
    };

    const value = {
          user,
          loading,
          login,
          logout,
          isAuthenticated: !!user
    };

    return (
          <AuthContext.Provider value={value}>
    {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
          throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
