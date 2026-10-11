import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

const EditEvent = () => {
  const { id } = useParams();
  const { user, showToast } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    venue: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    maxParticipants: 100,
    registrationDeadline: '',
    imageUrl: '',
    status: 'UPCOMING'
  });

  const categories = [
    'Technical',
    'Cultural',
    'Workshop',
    'Seminar',
    'Sports',
    'Competition',
    'Fest'
  ];

  const statuses = [
    'UPCOMING',
    'ONGOING',
    'COMPLETED',
    'CANCELLED'
  ];

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await eventService.getEventById(id);
        if (res.data) {
          const e = res.data;
          setFormData({
            title: e.title || '',
            description: e.description || '',
            category: e.category || 'Technical',
            venue: e.venue || '',
            eventDate: e.eventDate || '',
            startTime: e.startTime || '',
            endTime: e.endTime || '',
            maxParticipants: e.maxParticipants || 100,
            registrationDeadline: e.registrationDeadline || '',
            imageUrl: e.imageUrl || '',
            status: e.status || 'UPCOMING'
          });
        }
      } catch (err) {
        showToast('Failed to load event details', 'error');
        navigate(user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim() || !formData.venue.trim() || !formData.eventDate || !formData.registrationDeadline) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);
      await eventService.updateEvent(id, formData);
      showToast('Event updated successfully!', 'success');
      navigate(user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner message="Loading event details..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link
            to={user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events'}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', gap: '0.4rem' }}
          >
            <ArrowLeft size={16} /> Back to Events
          </Link>
        </div>

        <div className="dashboard-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <div>
              <h2>Edit Event</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Update details or change event status.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              margin: '1.25rem 0',
              fontSize: '0.875rem'
            }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                rows="4"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Venue *</label>
                <input
                  type="text"
                  name="venue"
                  className="form-control"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Event Date *</label>
                <input
                  type="date"
                  name="eventDate"
                  className="form-control"
                  value={formData.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registration Deadline *</label>
                <input
                  type="date"
                  name="registrationDeadline"
                  className="form-control"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Start Time</label>
                <input
                  type="text"
                  name="startTime"
                  className="form-control"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Time</label>
                <input
                  type="text"
                  name="endTime"
                  className="form-control"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Max Participants *</label>
                <input
                  type="number"
                  name="maxParticipants"
                  className="form-control"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Banner Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  className="form-control"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event Status *</label>
                <select
                  name="status"
                  className="form-control"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(user?.role === 'ADMIN' ? '/admin/events' : '/organizer/events')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditEvent;
