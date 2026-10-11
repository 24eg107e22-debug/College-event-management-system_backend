import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login, showToast } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      const redirectPath = location.state?.from?.pathname;

      if (redirectPath && !redirectPath.includes('/login') && !redirectPath.includes('/register')) {
        navigate(redirectPath);
      } else {
        if (user.role === 'ADMIN') navigate('/admin');
        else if (user.role === 'ORGANIZER') navigate('/organizer');
        else navigate('/student');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('For password resets in demo mode, please contact administrator (admin@campusconnect.com) or use default demo credentials.');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-badge">
            <Lock size={14} /> Secure Access
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your CampusConnect dashboard</p>
        </div>

        {/* Demo Fast-Login Assist */}
        <div className="demo-creds-box">
          <div className="demo-creds-title">
            <span>⚡ Demo Quick-Fill</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--primary)' }}>One-Click Test</span>
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill('student@campusconnect.com', 'student123')}
            >
              🎓 Student
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill('organizer@campusconnect.com', 'organizer123')}
            >
              💼 Organizer
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => handleDemoFill('admin@campusconnect.com', 'admin123')}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@campusconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-extra-row">
            <label className="remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={handleForgotPassword} className="forgot-link">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
