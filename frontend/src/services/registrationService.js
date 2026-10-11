import api from './api';

export const registrationService = {
  async registerForEvent(eventId) {
    return await api.post('/registrations', { eventId });
  },

  async getMyRegistrations() {
    return await api.get('/registrations/my');
  },

  async getEventRegistrations(eventId) {
    return await api.get(`/registrations/event/${eventId}`);
  },

  async cancelRegistration(id) {
    return await api.delete(`/registrations/${id}`);
  },

  async updateRegistrationStatus(id, status) {
    return await api.put(`/registrations/${id}/status`, { status });
  },

  async getAllRegistrations() {
    return await api.get('/registrations');
  }
};
