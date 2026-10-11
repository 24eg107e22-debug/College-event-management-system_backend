import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Calendar, Filter, Sparkles } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(queryParams.get('category') || 'All');
  const [status, setStatus] = useState('UPCOMING');
  const [sort, setSort] = useState('upcoming');

  const { isAuthenticated, role, showToast } = useAuth();

  const categories = [
    'All',
    'Technical',
    'Cultural',
    'Workshop',
    'Seminar',
    'Sports',
    'Competition',
    'Fest'
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAllEvents({
        search,
        category,
        status,
        sort
      });
      if (res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, status, sort]);

  const handleSearchSubmit = () => {
    fetchEvents();
  };

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to register for events', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      setRegisteringId(eventId);
      await registrationService.registerForEvent(eventId);
      showToast('Successfully registered for the event!', 'success');
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div>
      {/* Header Banner */}
      <div className="events-page-header">
        <h1>Discover College Events & Fests</h1>
        <p>Explore hackathons, workshops, cultural fests, and athletic championships across all campus departments.</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Floating Search & Filter Bar */}
        <div style={{ marginTop: '-2rem', marginBottom: '2.5rem' }}>
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
            sort={sort}
            setSort={setSort}
            onSearch={handleSearchSubmit}
          />
        </div>

        {/* Category Horizontal Pills */}
        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <LoadingSpinner message="Searching events..." />
        ) : events.length > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                Showing <strong>{events.length}</strong> events
              </span>
            </div>

            <div className="events-grid">
              {events.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  onRegister={handleRegister}
                  isRegistering={registeringId === evt.id}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="dashboard-section" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Calendar size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              No Events Found
            </h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
              We couldn't find any events matching your selected filter criteria. Try selecting another category or clearing your search.
            </p>
            <button
              onClick={() => {
                setCategory('All');
                setStatus('UPCOMING');
                setSearch('');
              }}
              className="btn btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
