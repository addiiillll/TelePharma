const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const adminApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return response;
  },

  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      credentials: 'include',
    });
    return response;
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/profile`, {
      credentials: 'include',
    });
    return response;
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      credentials: 'include',
    });
    return response;
  },

  getOnlineDoctors: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/doctors/online`, {
      credentials: 'include',
    });
    return response;
  },

  getActiveSessions: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/sessions/active`, {
      credentials: 'include',
    });
    return response;
  },

  getDeviceLocations: async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/devices/locations`, {
      credentials: 'include',
    });
    return response;
  },

  getDoctors: async (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/api/admin/doctors?${searchParams}`, {
      credentials: 'include',
    });
    return response;
  },

  getSessions: async (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/api/admin/sessions?${searchParams}`, {
      credentials: 'include',
    });
    return response;
  },

  getPharmacies: async (params: { page?: number; limit?: number; search?: string; status?: string } = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/api/admin/pharmacies?${searchParams}`, {
      credentials: 'include',
    });
    return response;
  },
};