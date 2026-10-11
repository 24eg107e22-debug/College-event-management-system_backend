import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Users,
  CheckCircle,
  History,
  UserCheck,
  User,
  LogOut,
  Shield,
  Briefcase,
  GraduationCap,
  Layers
} from 'lucide-react';

const Sidebar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleIcon = () => {
    if (role === 'ADMIN') return <Shield size={14} />;
    if (role === 'ORGANIZER') return <Briefcase size={14} />;
    return <GraduationCap size={14} />;
  };

  const renderStudentLinks = () => (
    <>
      <NavLink to="/student" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Calendar size={18} />
        Browse Events
      </NavLink>
      <NavLink to="/student/registrations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <CheckCircle size={18} />
        My Registrations
      </NavLink>
      <NavLink to="/student/history" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <History size={18} />
        Participation History
      </NavLink>
    </>
  );

  const renderOrganizerLinks = () => (
    <>
      <NavLink to="/organizer" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>
      <NavLink to="/organizer/create-event" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <PlusCircle size={18} />
        Create Event
      </NavLink>
      <NavLink to="/organizer/events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Calendar size={18} />
        My Events
      </NavLink>
      <NavLink to="/organizer/participants" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        Participants
      </NavLink>
    </>
  );

  const renderAdminLinks = () => (
    <>
      <NavLink to="/admin" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={18} />
        Dashboard
      </NavLink>
      <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Users size={18} />
        Manage Users
      </NavLink>
      <NavLink to="/admin/events" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <Calendar size={18} />
        Manage Events
      </NavLink>
      <NavLink to="/admin/registrations" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
        <UserCheck size={18} />
        Registrations
      </NavLink>
    </>
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '0.9rem'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <div className="sidebar-role-badge">
          {getRoleIcon()}
          {role || 'STUDENT'}
        </div>
      </div>

      <nav className="sidebar-nav">
        {role === 'ADMIN' && renderAdminLinks()}
        {role === 'ORGANIZER' && renderOrganizerLinks()}
        {role === 'STUDENT' && renderStudentLinks()}

        <div style={{ margin: '0.75rem 0', borderTop: '1px solid var(--border)' }} />

        <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <User size={18} />
          My Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', color: 'var(--danger)' }}>
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
