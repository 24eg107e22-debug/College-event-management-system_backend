import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      padding: '4rem 1.5rem 2rem 1.5rem',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        {/* Brand Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <Calendar size={18} />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>
              CampusConnect
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
            "Connect • Participate • Celebrate" – Your centralized university platform for discovering events, managing participants, and celebrating student life.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700', marginBottom: '1rem' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
            <li><Link to="/" style={{ color: '#cbd5e1' }}>Home</Link></li>
            <li><Link to="/events" style={{ color: '#cbd5e1' }}>Explore All Events</Link></li>
            <li><Link to="/login" style={{ color: '#cbd5e1' }}>Portal Login</Link></li>
            <li><Link to="/register" style={{ color: '#cbd5e1' }}>Student Registration</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700', marginBottom: '1rem' }}>
            Event Categories
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.875rem' }}>
            <li><Link to="/events?category=Technical" style={{ color: '#cbd5e1' }}>💻 Technical & Coding</Link></li>
            <li><Link to="/events?category=Cultural" style={{ color: '#cbd5e1' }}>🎭 Cultural & Music</Link></li>
            <li><Link to="/events?category=Workshop" style={{ color: '#cbd5e1' }}>🎓 Workshops & Hands-on</Link></li>
            <li><Link to="/events?category=Sports" style={{ color: '#cbd5e1' }}>⚽ Sports Tournaments</Link></li>
            <li><Link to="/events?category=Fest" style={{ color: '#cbd5e1' }}>🎪 Campus Fests</Link></li>
          </ul>
        </div>

        {/* Contact info */}
        <div id="contact">
          <h4 style={{ color: 'white', fontSize: '0.9375rem', fontWeight: '700', marginBottom: '1rem' }}>
            Campus Helpdesk
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#818cf8" />
              <span>events@campusconnect.edu</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#818cf8" />
              <span>+1 (800) 246-8000</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#818cf8" />
              <span>University Student Activity Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        fontSize: '0.8125rem'
      }}>
        <div>
          © {new Date().getFullYear()} CampusConnect – College Event Management System. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          Built with Spring Boot & React
        </div>
      </div>
    </footer>
  );
};

export default Footer;
