import api from './api';

export const activityService = {
  async createActivity(activityData) {
    return await api.post('/activities', activityData);
  },

  async getActivitiesByEvent(eventId) {
    return await api.get(`/activities/event/${eventId}`);
  },

  async updateActivity(id, activityData) {
    return await api.put(`/activities/${id}`, activityData);
  },

  async deleteActivity(id) {
    return await api.delete(`/activities/${id}`);
  }
};
