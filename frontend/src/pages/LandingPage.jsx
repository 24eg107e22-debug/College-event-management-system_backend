import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import {
  Calendar,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
  Award,
  Clock,
  Layers,
  ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, role, showToast } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getAllEvents({ status: 'UPCOMING' });
        if (res.data) {
          setFeaturedEvents(res.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = [
    { name: 'Technical', icon: '💻', desc: 'Hackathons, Robotics & Code battles', color: '#4f46e5' },
    { name: 'Cultural', icon: '🎭', desc: 'Music bands, Drama & Art exhibits', color: '#ec4899' },
    { name: 'Competitions', icon: '🏆', desc: 'Quizzes, Gaming & Creative showdowns', color: '#f59e0b' },
    { name: 'Sports', icon: '⚽', desc: 'Inter-college tournaments & Athletics', color: '#10b981' },
    { name: 'Workshops', icon: '🎓', desc: 'Hands-on AI, Web dev & Deep tech labs', color: '#06b6d4' },
    { name: 'Seminars', icon: '🎤', desc: 'Keynotes, Startup summits & Panel talks', color: '#8b5cf6' }
  ];

  const getDashboardPath = () => {
    if (role === 'ADMIN') return '/admin';
    if (role === 'ORGANIZER') return '/organizer';
    return '/student';
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        color: 'white',
        padding: '5rem 1.5rem 6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow accent bubbles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '3.5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Hero Left Content */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#c7d2fe',
              marginBottom: '1.5rem'
            }}>
              <Sparkles size={16} color="#38bdf8" />
              <span>CampusConnect – College Event Management System</span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
              fontWeight: '800',
              lineHeight: '1.15',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem'
            }}>
              Discover. <br />
              <span style={{
                background: 'linear-gradient(90deg, #38bdf8, #818cf8, #c084fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Register. Experience.
              </span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: '#cbd5e1',
              lineHeight: '1.7',
              marginBottom: '2.25rem',
              maxWidth: '540px'
            }}>
              Your one-stop platform for discovering and participating in exciting college events. Connect with fellow students, register with a single click, and never miss out on campus life!
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/events" className="btn btn-primary btn-lg" style={{ gap: '0.6rem' }}>
                Explore Events <ArrowRight size={18} />
              </Link>
              {isAuthenticated ? (
                <Link to={getDashboardPath()} className="btn btn-secondary btn-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Get Started
                </Link>
              )}
            </div>

            {/* Quick Stat Highlights */}
            <div style={{
              display: 'flex',
              gap: '2.5rem',
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white' }}>50+</div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Campus Events</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white' }}>2,500+</div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Active Students</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'white' }}>100%</div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>Paperless Process</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div style={{ position: 'relative' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '1.5rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                height: '320px',
                marginBottom: '1.25rem'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80"
                  alt="College TechFest Showcase"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#38bdf8'
                }}>
                  FEATURED EVENT
                </div>
              </div>
              <div style={{ padding: '0.5rem' }}>
                <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Annual Fest</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.5rem' }}>
                  TechFest 2026: Future of AI & Robotics
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                  Project exhibitions, competitive coding, robotics combat & industry keynotes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section style={{ padding: '5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              What's Happening
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Upcoming Campus Events
            </h2>
          </div>
          <Link to="/events" className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
            View All Events <ChevronRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Loading events...</div>
        ) : featuredEvents.length > 0 ? (
          <div className="events-grid">
            {featuredEvents.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No upcoming events found at the moment.
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section style={{ background: '#f1f5f9', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
              Explore By Interest
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Event Categories
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem' }}>
              Find the events that match your passion and interests.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/events?category=${encodeURIComponent(cat.name)}`}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  transition: 'var(--transition)'
                }}
                className="category-card"
              >
                <div style={{
                  fontSize: '2rem',
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {cat.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                    {cat.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why CampusConnect Section */}
      <section id="about" style={{ padding: '5.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>
            Key Advantages
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
            Why CampusConnect?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
            Built specifically to solve manual paperwork, chaotic registrations, and fragmented event communications.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem'
        }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Easy Online Registration
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Say goodbye to physical registration desks and paper forms. Sign up for any workshop, fest or competition in seconds.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#f3e8ff',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Centralized Event Management
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              A single unified portal for all departments, clubs, sports committees, and cultural societies to publish and manage activities.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Real-Time Event Information
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Get instant updates on venues, timings, agendas, seat capacities, and status updates right at your fingertips.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--success-light)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Simple Participant Management
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Organizers can track registrations live, filter attendee rosters, mark attendance, and export reports in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
        color: 'white',
        padding: '5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Ready to Experience Campus Events?
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#e0e7ff', marginBottom: '2rem', lineHeight: '1.6' }}>
            Join thousands of students and faculty organizers today. Connect, participate, and celebrate your college journey.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              Register as Student
            </Link>
            <Link to="/events" className="btn btn-secondary btn-lg" style={{ background: 'transparent', color: 'white', border: '2px solid white' }}>
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
