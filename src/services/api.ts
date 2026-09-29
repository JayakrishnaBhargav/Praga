import { User, Scheme, Complaint, AIAnalysisResult, AdminStats } from '../types';

const TOKEN_KEY = 'praja_auth_token';
const USER_KEY = 'praja_auth_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: (): User | null => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setUser: (user: User) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(USER_KEY),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP error! status: ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Authentication
  async register(citizenData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    age: number;
    occupation: string;
    income: number;
    state: string;
    district: string;
    city: string;
  }): Promise<{ token: string; user: User }> {
    const res = await request<{ message: string; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(citizenData)
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: User }> {
    const res = await request<{ message: string; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async employeeLogin(credentials: {
    employee_code: string;
    password: string;
    department?: string;
  }): Promise<{ token: string; user: User }> {
    const res = await request<{ message: string; token: string; user: User }>('/api/auth/employee-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    authStorage.setToken(res.token);
    authStorage.setUser(res.user);
    return res;
  },

  async getMe(): Promise<User> {
    const res = await request<{ user: User }>('/api/auth/me');
    authStorage.setUser(res.user);
    return res.user;
  },

  logout() {
    authStorage.clear();
  },

  // AI Sequence Analysis (V1 Demo -> V2 LSTM)
  async analyzeComplaint(payload: { description: string; category?: string }): Promise<AIAnalysisResult> {
    return request<AIAnalysisResult>('/api/ai/analyze-complaint', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // Complaints
  async getComplaints(params: {
    user_id?: string;
    department?: string;
    employee_code?: string;
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
  } = {}): Promise<{ complaints: Complaint[]; total: number }> {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const qs = query.toString();
    return request<{ complaints: Complaint[]; total: number }>(`/api/complaints${qs ? `?${qs}` : ''}`);
  },

  async getComplaintById(id: string): Promise<Complaint> {
    return request<Complaint>(`/api/complaints/${encodeURIComponent(id)}`);
  },

  async submitComplaint(data: {
    description: string;
    category: string;
    state: string;
    district: string;
    city: string;
    media_urls?: { type: 'image' | 'video'; url: string; name: string }[];
    user_id?: string;
    user_name?: string;
    user_phone?: string;
    ai_analysis?: AIAnalysisResult;
  }): Promise<{ message: string; complaint: Complaint }> {
    return request<{ message: string; complaint: Complaint }>('/api/complaints', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateComplaintStatus(
    id: string,
    payload: {
      status?: string;
      note?: string;
      officer_name?: string;
      priority?: string;
      assigned_employee_code?: string;
    }
  ): Promise<{ message: string; complaint: Complaint }> {
    return request<{ message: string; complaint: Complaint }>(`/api/complaints/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  },

  // Schemes
  async getSchemes(params: { category?: string; search?: string } = {}): Promise<{ schemes: Scheme[]; total: number }> {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request<{ schemes: Scheme[]; total: number }>(`/api/schemes${qs ? `?${qs}` : ''}`);
  },

  async checkEligibility(profile: {
    age: number;
    income: number;
    occupation: string;
    state: string;
  }): Promise<{ total_evaluated: number; eligible_count: number; schemes: Scheme[] }> {
    return request<{ total_evaluated: number; eligible_count: number; schemes: Scheme[] }>(
      '/api/schemes/check-eligibility',
      {
        method: 'POST',
        body: JSON.stringify(profile)
      }
    );
  },

  // Admin
  async getAdminStats(): Promise<AdminStats> {
    return request<AdminStats>('/api/admin/stats');
  }
};
