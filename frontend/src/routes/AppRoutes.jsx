import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Pages
import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import OrganizerDashboard from '../pages/OrganizerDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import MyRegistrations from '../pages/MyRegistrations';
import CreateEvent from '../pages/CreateEvent';
import EditEvent from '../pages/EditEvent';
import Participants from '../pages/Participants';
import ManageUsers from '../pages/ManageUsers';
import ManageEvents from '../pages/ManageEvents';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Common Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Student Protected Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/registrations"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MyRegistrations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/history"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <MyRegistrations isHistoryView={true} />
          </ProtectedRoute>
        }
      />

      {/* Organizer Protected Routes */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/events"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
            <OrganizerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/create-event"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/edit-event/:id"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
            <EditEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/organizer/participants"
        element={
          <ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']}>
            <Participants />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Participants />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
