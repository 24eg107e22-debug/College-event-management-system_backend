import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import Sidebar from '../components/Sidebar';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, CheckCircle2, Trophy, Clock, ArrowRight, Sparkles } from 'lucide-react';

const StudentDashboard = () => {
  const { user, showToast } = useAuth();
  const [events, setEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventsRes, regsRes] = await Promise.all([
        eventService.getAllEvents({ status: 'UPCOMING' }),
        registrationService.getMyRegistrations()
      ]);

      if (eventsRes.data) setEvents(eventsRes.data);
      if (regsRes.data) setMyRegistrations(regsRes.data);
    } catch (err) {
      console.error(err);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegister = async (eventId) => {
    setRegisteringId(eventId);
    try {
      await registrationService.registerForEvent(eventId);
      showToast('Successfully registered for the event!', 'success');
      fetchData(); // refresh counts and button states
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  // Metrics
  const activeRegistrations = myRegistrations.filter(r => r.status === 'REGISTERED');
  const attendedRegistrations = myRegistrations.filter(r => r.status === 'ATTENDED');

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Welcome, {user?.name || 'Student'}! 👋</h1>
            <p>Track your registrations, browse upcoming workshops, and participate in campus activities.</p>
          </div>
          <Link to="/events" className="btn btn-primary">
            Explore All Events <ArrowRight size={16} />
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon primary">
              <Calendar size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{events.length}</span>
              <span className="stat-label">Upcoming Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon secondary">
              <CheckCircle2 size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{activeRegistrations.length}</span>
              <span className="stat-label">My Registered Events</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon success">
              <Trophy size={26} />
            </div>
            <div className="stat-details">
              <span className="stat-value">{attendedRegistrations.length}</span>
              <span className="stat-label">Completed / Attended</span>
            </div>
          </div>
        </div>

        {/* Recommended Events Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: '700' }}>
                <Sparkles size={16} /> Handpicked For You
              </div>
              <h2>Recommended Events</h2>
            </div>
            <Link to="/events" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading recommended events..." />
          ) : events.length > 0 ? (
            <div className="events-grid" style={{ marginBottom: 0 }}>
              {events.slice(0, 6).map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onRegister={handleRegister}
                  isRegistering={registeringId === evt.id}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No upcoming events found. Check back later!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
