import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Download, CheckCircle, XCircle, Users, Filter } from 'lucide-react';

const Participants = () => {
  const { user, showToast } = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialEventId = queryParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(initialEventId || '');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load organizer's events or all events if admin
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let res;
        if (user?.role === 'ADMIN') {
          res = await eventService.getAllEvents();
        } else if (user?.id) {
          res = await eventService.getOrganizerEvents(user.id);
        }
        if (res?.data && res.data.length > 0) {
          setEvents(res.data);
          if (!selectedEventId) {
            setSelectedEventId(res.data[0].id.toString());
          }
        }
      } catch (err) {
        showToast('Failed to load events list', 'error');
      }
    };
    fetchEvents();
  }, [user]);

  // Load participants whenever selectedEventId changes
  useEffect(() => {
    if (!selectedEventId) return;

    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const res = await registrationService.getEventRegistrations(selectedEventId);
        if (res.data) {
          setParticipants(res.data);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load participants', 'error');
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [selectedEventId]);

  // Update status (e.g. mark ATTENDED)
  const handleStatusChange = async (regId, newStatus) => {
    try {
      await registrationService.updateRegistrationStatus(regId, newStatus);
      showToast(`Participant status updated to ${newStatus}`, 'success');
      // Update local state
      setParticipants((prev) =>
        prev.map((p) => (p.id === regId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // CSV Export
  const handleExportCSV = () => {
    if (participants.length === 0) {
      showToast('No participants to export', 'warning');
      return;
    }

    const currentEvent = events.find((e) => e.id.toString() === selectedEventId.toString());
    const eventTitle = currentEvent ? currentEvent.title : 'Participants';

    const headers = ['Student Name', 'College ID', 'Email', 'Phone', 'Registration Date', 'Status'];
    const rows = filteredParticipants.map((p) => [
      `"${p.studentName || ''}"`,
      `"${p.collegeId || ''}"`,
      `"${p.studentEmail || ''}"`,
      `"${p.studentPhone || ''}"`,
      `"${p.registrationDate ? new Date(p.registrationDate).toLocaleDateString() : ''}"`,
      `"${p.status || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}_Participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Participant list exported to CSV', 'success');
  };

  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      !search.trim() ||
      (p.studentName && p.studentName.toLowerCase().includes(search.toLowerCase())) ||
      (p.collegeId && p.collegeId.toLowerCase().includes(search.toLowerCase())) ||
      (p.studentEmail && p.studentEmail.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-title">
            <h1>Participant Management</h1>
            <p>Review attendees, manage check-in status, and export participant records.</p>
          </div>

          <button
            onClick={handleExportCSV}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
            disabled={participants.length === 0}
          >
            <Download size={16} /> Export CSV Roster
          </button>
        </div>

        {/* Event selector and filter controls */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Event Dropdown */}
            <div>
              <label className="form-label">Select Event</label>
              <select
                className="form-control"
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.registeredCount ?? 0} registered)
                  </option>
                ))}
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label className="form-label">Search Attendees</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="Name, College ID, or Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="form-label">Registration Status</label>
              <select
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Statuses ({participants.length})</option>
                <option value="REGISTERED">Registered</option>
                <option value="ATTENDED">Attended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        {loading ? (
          <LoadingSpinner message="Loading participant roster..." />
        ) : filteredParticipants.length > 0 ? (
          <div className="table-responsive">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>College ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Registered On</th>
                  <th>Status</th>
                  <th>Attendance / Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParticipants.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                        {p.studentName}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-neutral">{p.collegeId || 'N/A'}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.studentEmail}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.studentPhone || 'N/A'}</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {p.registrationDate ? new Date(p.registrationDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td>
                      {p.status === 'ATTENDED' ? (
                        <span className="badge badge-success">Attended</span>
                      ) : p.status === 'CANCELLED' ? (
                        <span className="badge badge-danger">Cancelled</span>
                      ) : (
                        <span className="badge badge-primary">Registered</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {p.status !== 'ATTENDED' && (
                          <button
                            onClick={() => handleStatusChange(p.id, 'ATTENDED')}
                            className="btn btn-sm btn-success"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            title="Mark as Attended"
                          >
                            Mark Attended
                          </button>
                        )}
                        {p.status !== 'REGISTERED' && (
                          <button
                            onClick={() => handleStatusChange(p.id, 'REGISTERED')}
                            className="btn btn-sm btn-secondary"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            Reset
                          </button>
                        )}
                        {p.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusChange(p.id, 'CANCELLED')}
                            className="btn btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--danger)', background: 'var(--danger-light)' }}
                            title="Cancel Registration"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="dashboard-section" style={{ textAlign: 'center', padding: '3.5rem' }}>
            <Users size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>No participants found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              No registrations found matching the selected filter criteria.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Participants;
