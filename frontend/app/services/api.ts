import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email: string, password: string, firstName: string, lastName: string) =>
    api.post('/api/users/register', { email, password, firstName, lastName }),
  login: (email: string, password: string) =>
    api.post('/api/users/login', { email, password }),
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (payload: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    bio?: string;
    profileImage?: string;
  }) => api.patch('/api/users/profile', payload),
};

export const complaintsService = {
  create: (title: string, content: string, companyName: string, categoryId: number) =>
    api.post('/api/complaints', { title, content, companyName, categoryId }),
  getAll: (page = 1, limit = 10) =>
    api.get('/api/complaints', { params: { page, limit } }),
  getById: (id: number) => api.get(`/api/complaints/${id}`),
  getBySlug: (slug: string) => api.get(`/api/complaints/s/${slug}`),
  getByCategory: (categoryId: number, page = 1, limit = 10) =>
    api.get(`/api/complaints/category/${categoryId}`, { params: { page, limit } }),
  search: (query: string, page = 1, limit = 10) =>
    api.get('/api/complaints/search', { params: { q: query, page, limit } }),
  getTrending: (limit = 10) =>
    api.get('/api/complaints/trending', { params: { limit } }),
  toggleLike: (id: number) => api.post(`/api/complaints/${id}/like`),
  incrementView: (id: number) => api.post(`/api/complaints/${id}/view`),
  getComments: (id: number) => api.get(`/api/complaints/${id}/comments`),
  addComment: (id: number, content: string) =>
    api.post(`/api/complaints/${id}/comments`, { content }),
  delete: (id: number) => api.delete(`/api/complaints/${id}`),
  updateStatus: (id: number, status: string) =>
    api.patch(`/api/complaints/${id}/status`, { status }),
  getStats: () => api.get('/api/complaints/stats'),
};

export const categoriesService = {
  getAll: () => api.get('/api/categories'),
  getById: (id: number) => api.get(`/api/categories/${id}`),
  create: (name: string, description: string) =>
    api.post('/api/categories', { name, description }),
  update: (id: number, name: string, description: string) =>
    api.put(`/api/categories/${id}`, { name, description }),
  delete: (id: number) => api.delete(`/api/categories/${id}`),
};

export const adminService = {
  getPendingEvidences: (page = 1, limit = 10) =>
    api.get('/api/admin/evidence/pending', { params: { page, limit } }),
  getEvidenceById: (id: number) => api.get(`/api/admin/evidence/${id}`),
  approveEvidence: (id: number, approved: boolean, feedback?: string) =>
    api.post(`/api/admin/evidence/${id}/approve`, { approved, feedback }),
  uploadEvidence: (formData: FormData) =>
    api.post('/api/admin/evidence/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getStats: () => api.get('/api/admin/stats'),
  getApprovalHistory: (page = 1, limit = 10) =>
    api.get('/api/admin/approvals', { params: { page, limit } }),
  getDashboardStats: () => api.get('/api/admin/dashboard'),
  getAllEvidences: (page = 1, limit = 10) =>
    api.get('/api/admin/evidence', { params: { page, limit } }),
};

export const usersService = {
  getAll: () => api.get('/api/users'),
  getById: (id: number) => api.get(`/api/users/${id}`),
  updateRank: (id: number, rank: string) =>
    api.patch(`/api/users/${id}/rank`, { rank }),
  updateUser: (id: number, data: {
    firstName?: string;
    lastName?: string;
    isAdmin?: boolean;
  }) => api.patch(`/api/users/${id}`, data),
};

export const statsService = {
  getDashboardStats: () => api.get('/api/admin/dashboard'),
  getPublicStats: () => api.get('/api/stats/public'),
};

export default api;
