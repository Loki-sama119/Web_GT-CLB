const BASE_URL = '/api/v1';

async function request(endpoint, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include',
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Đã có lỗi xảy ra từ máy chủ');
    error.status = response.status;
    error.errors = data.errors;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getMe: () => request('/auth/me'),

  // Profile
  getProfile: () => request('/users/profile'),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body }),

  // Clubs & Categories
  getCategories: () => request('/categories'),
  getClubs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/clubs${query ? `?${query}` : ''}`);
  },
  getClubBySlug: (slug) => request(`/clubs/${slug}`),
  createClub: (body) => request('/clubs', { method: 'POST', body }),
  updateClub: (id, body) => request(`/clubs/${id}`, { method: 'PUT', body }),

  // Recruitments
  getClubRecruitments: (clubId) => request(`/clubs/${clubId}/recruitments`),
  getRecruitmentById: (id) => request(`/recruitments/${id}`),
  createRecruitment: (clubId, body) => request(`/clubs/${clubId}/recruitments`, { method: 'POST', body }),
  updateRecruitmentStatus: (id, status) => request(`/recruitments/${id}/status`, { method: 'PATCH', body: { status } }),

  // Applications
  applyRecruitment: (campaignId, answers) => request(`/recruitments/${campaignId}/apply`, { method: 'POST', body: { answers } }),
  getMyApplications: () => request('/applications/my-applications'),
  getClubApplications: (clubId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/clubs/${clubId}/applications${query ? `?${query}` : ''}`);
  },
  getApplicationById: (id) => request(`/applications/${id}`),
  reviewApplication: (id, body) => request(`/applications/${id}/status`, { method: 'PATCH', body }),
  withdrawApplication: (id) => request(`/applications/${id}/withdraw`, { method: 'POST' }),

  // Memberships
  getClubMembers: (clubId) => request(`/clubs/${clubId}/members`),
  updateMemberRole: (clubId, memberId, role) => request(`/clubs/${clubId}/members/${memberId}/role`, { method: 'PATCH', body: { role } }),
  removeMember: (clubId, memberId) => request(`/clubs/${clubId}/members/${memberId}`, { method: 'DELETE' }),

  // Events
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/events${query ? `?${query}` : ''}`);
  },
  registerEvent: (eventId) => request(`/events/${eventId}/register`, { method: 'POST' }),

  // Stats
  getStatsOverview: () => request('/stats/overview'),

  // Super Admin
  getAdminDashboard: () => request('/admin/dashboard'),
  getAdminUsers: () => request('/admin/users'),
  assignClubAdmin: (body) => request('/admin/assign-club-admin', { method: 'POST', body }),
  getAuditLogs: () => request('/admin/audit-logs')
};
