import api from './api';

export const userService = {
  async getAllUsers() {
    return await api.get('/users');
  },

  async getUserById(id) {
    return await api.get(`/users/${id}`);
  },

  async updateUser(id, userData) {
    return await api.put(`/users/${id}`, userData);
  },

  async deleteUser(id) {
    return await api.delete(`/users/${id}`);
  },

  async updateUserStatus(id, status) {
    return await api.put(`/users/${id}/status`, { status });
  },

  async getAdminStats() {
    return await api.get('/users/stats/admin');
  }
};
