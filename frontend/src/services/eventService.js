import api from './api';

export const eventService = {
  async getAllEvents(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.sort) query.append('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return await api.get(`/events${queryString}`);
  },

  async getEventById(id) {
    return await api.get(`/events/${id}`);
  },

  async createEvent(eventData) {
    return await api.post('/events', eventData);
  },

  async updateEvent(id, eventData) {
    return await api.put(`/events/${id}`, eventData);
  },

  async deleteEvent(id) {
    return await api.delete(`/events/${id}`);
  },

  async cancelEvent(id) {
    return await api.put(`/events/${id}/cancel`);
  },

  async getEventsByCategory(category) {
    return await api.get(`/events/category/${encodeURIComponent(category)}`);
  },

  async getOrganizerEvents(organizerId) {
    return await api.get(`/events/organizer/${organizerId}`);
  },

  async getOrganizerStats(organizerId) {
    return await api.get(`/events/stats/organizer/${organizerId}`);
  }
};
