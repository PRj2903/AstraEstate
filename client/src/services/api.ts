import {
  Property,
  Enquiry,
  PaginationMeta,
  PropertyFilterParams,
  SiteSettings,
  AdminUser,
  DashboardMetrics,
} from '../types';

const API_BASE = '/api';

export const getStoredToken = (): string | null => {
  return localStorage.getItem('astrea_admin_token');
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem('astrea_admin_token', token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem('astrea_admin_token');
  localStorage.removeItem('astrea_admin_user');
};

export const getStoredUser = (): AdminUser | null => {
  const user = localStorage.getItem('astrea_admin_user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: AdminUser): void => {
  localStorage.setItem('astrea_admin_user', JSON.stringify(user));
};

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({ success: false, message: 'Server communication error' }));

  if (!res.ok) {
    if (res.status === 401 && url.startsWith('/admin')) {
      removeStoredToken();
    }
    const message = data.message || `Request failed with status ${res.status}`;
    const error: any = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

// =================== PUBLIC API ===================

export const api = {
  // Properties
  async getFeaturedProperties(): Promise<Property[]> {
    const res = await fetchJson<{ success: boolean; data: Property[] }>('/properties/featured');
    return res.data;
  },

  async getLocations(): Promise<string[]> {
    const res = await fetchJson<{ success: boolean; data: string[] }>('/properties/locations/list');
    return res.data;
  },

  async getProperties(params: PropertyFilterParams = {}): Promise<{
    data: Property[];
    meta: PaginationMeta;
  }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    const res = await fetchJson<{
      success: boolean;
      data: Property[];
      meta: PaginationMeta;
    }>(`/properties?${query.toString()}`);

    return { data: res.data, meta: res.meta };
  },

  async getPropertyBySlug(slugOrId: string): Promise<{
    data: Property;
    related: Property[];
  }> {
    const res = await fetchJson<{
      success: boolean;
      data: Property;
      related: Property[];
    }>(`/properties/${slugOrId}`);
    return { data: res.data, related: res.related };
  },

  // Enquiries
  async submitEnquiry(payload: {
    propertyId?: string | null;
    name: string;
    email: string;
    phone: string;
    preferredContact: string;
    message: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: { refNumber: string; receivedAt: string };
  }> {
    return await fetchJson('/enquiries', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings> {
    const res = await fetchJson<{ success: boolean; data: SiteSettings }>('/settings');
    return res.data;
  },

  // =================== ADMIN API ===================

  async adminLogin(email: string, password: string): Promise<{
    token: string;
    user: AdminUser;
  }> {
    const res = await fetchJson<{
      success: boolean;
      data: { token: string; user: AdminUser };
    }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setStoredToken(res.data.token);
    setStoredUser(res.data.user);
    return res.data;
  },

  async getAdminProfile(): Promise<AdminUser> {
    const res = await fetchJson<{ success: boolean; data: AdminUser }>('/admin/auth/me');
    return res.data;
  },

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const res = await fetchJson<{ success: boolean; data: DashboardMetrics }>('/admin/dashboard/metrics');
    return res.data;
  },

  async getAdminProperties(params: {
    status?: string;
    listingType?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Property[]; meta: PaginationMeta }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    const res = await fetchJson<{ success: boolean; data: Property[]; meta: PaginationMeta }>(
      `/admin/properties?${query.toString()}`
    );
    return { data: res.data, meta: res.meta };
  },

  async getAdminPropertyById(id: string): Promise<Property> {
    const res = await fetchJson<{ success: boolean; data: Property }>(`/admin/properties/${id}`);
    return res.data;
  },

  async createAdminProperty(data: any): Promise<Property> {
    const res = await fetchJson<{ success: boolean; data: Property }>('/admin/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateAdminProperty(id: string, data: any): Promise<Property> {
    const res = await fetchJson<{ success: boolean; data: Property }>(`/admin/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateAdminPropertyStatus(id: string, status: string): Promise<any> {
    return await fetchJson(`/admin/properties/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async toggleAdminPropertyFeatured(id: string, isFeatured: boolean): Promise<any> {
    return await fetchJson(`/admin/properties/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ isFeatured }),
    });
  },

  async deleteAdminProperty(id: string): Promise<any> {
    return await fetchJson(`/admin/properties/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Enquiries
  async getAdminEnquiries(params: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ data: Enquiry[]; meta: PaginationMeta }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.set(key, String(value));
      }
    });

    const res = await fetchJson<{ success: boolean; data: Enquiry[]; meta: PaginationMeta }>(
      `/admin/enquiries?${query.toString()}`
    );
    return { data: res.data, meta: res.meta };
  },

  async getAdminEnquiryById(id: string): Promise<Enquiry> {
    const res = await fetchJson<{ success: boolean; data: Enquiry }>(`/admin/enquiries/${id}`);
    return res.data;
  },

  async updateAdminEnquiry(id: string, data: { status?: string; internalNotes?: string }): Promise<Enquiry> {
    const res = await fetchJson<{ success: boolean; data: Enquiry }>(`/admin/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteAdminEnquiry(id: string): Promise<any> {
    return await fetchJson(`/admin/enquiries/${id}`, {
      method: 'DELETE',
    });
  },

  // Admin Settings
  async getAdminSettings(): Promise<Array<{ id: string; key: string; value: string; description: string }>> {
    const res = await fetchJson<{ success: boolean; data: any[] }>('/admin/settings');
    return res.data;
  },

  async updateAdminSettings(settings: Record<string, string>): Promise<any> {
    return await fetchJson('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};
