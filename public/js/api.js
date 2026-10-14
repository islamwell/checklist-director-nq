// API Client and Storage Helper for NurulQuran Inspection System

const TOKEN_KEY = 'nq_session_token';
const USER_KEY = 'nq_user_data';

export const api = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  },

  setUser(user) {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  },

  async request(path, options = {}) {
    const headers = options.headers || {};
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const res = await fetch(path, {
        ...options,
        headers
      });

      if (res.status === 401 && !path.includes('/api/auth/')) {
        this.setToken(null);
        this.setUser(null);
        window.location.reload();
        throw new Error('Session expired');
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  },

  // Auth
  async login(username, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) this.setToken(data.token);
    if (data.user) this.setUser(data.user);
    return data;
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
    this.setToken(null);
    this.setUser(null);
  },

  async me() {
    return this.request('/api/auth/me');
  },

  async setup() {
    return this.request('/api/auth/setup', { method: 'POST' });
  },

  // Users
  async getUsers() {
    return this.request('/api/users');
  },

  async createUser(userData) {
    return this.request('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Visits
  async getVisits(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/visits?${params.toString()}`);
  },

  async getVisit(id) {
    return this.request(`/api/visits/${id}`);
  },

  async createVisit(data) {
    return this.request('/api/visits', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateVisit(id, data) {
    return this.request(`/api/visits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteVisit(id) {
    return this.request(`/api/visits/${id}`, {
      method: 'DELETE'
    });
  },

  // Share Options (Inside Admin)
  async getShares(visitId) {
    return this.request(`/api/visits/${visitId}/shares`);
  },

  async createShare(visitId, { label, daysValid }) {
    return this.request(`/api/visits/${visitId}/share`, {
      method: 'POST',
      body: JSON.stringify({ label, daysValid })
    });
  },

  async revokeShare(token) {
    return this.request(`/api/shares/${token}`, {
      method: 'DELETE'
    });
  },

  async getSharedReport(token) {
    return this.request(`/api/shared/${token}`);
  },

  // Rotation Schedule & Stats
  async getSchedule(year = 2026) {
    return this.request(`/api/schedule?year=${year}`);
  },

  async updateScheduleItem(payload) {
    return this.request('/api/schedule', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getStats() {
    return this.request('/api/stats');
  }
};
