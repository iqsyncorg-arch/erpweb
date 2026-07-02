const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: 'student' | 'admin';
  dob?: string;
  gender?: string;
  aadhaar?: string;
  address?: string;
  college?: string;
  studentStatus?: string;
  workStatus?: string;
  reason?: string;
  registeredAt?: string;
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function setAuth(token: string, user: AuthUser): void {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}

export function getAuthUser(): AuthUser | null {
  const raw = localStorage.getItem('auth_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  return data as T;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  aadhaar: string;
  address: string;
  college: string;
  studentStatus: string;
  workStatus: string;
  reason: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<{ success: boolean; message: string; email: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyOtp: (email: string, otp: string, password: string) =>
    request<{ success: boolean; token: string; user: AuthUser; message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, password }),
    }),

  resendOtp: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  login: (username: string, password: string) =>
    request<{ success: boolean; token: string; user: AuthUser; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  forgotPassword: (identifier: string) =>
    request<{ success: boolean; message: string; email: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),

  resendForgotPasswordOtp: (email: string) =>
    request<{ success: boolean; message: string }>('/auth/resend-forgot-password-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (email: string, otp: string, password: string) =>
    request<{ success: boolean; message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, password }),
    }),

  me: () => request<{ success: boolean; user: AuthUser }>('/auth/me'),
};

export const adminApi = {
  getStudents: (search = '', page = 1) =>
    request<{ success: boolean; data: Record<string, unknown>[]; pagination: { total: number } }>(
      `/admin/students?search=${encodeURIComponent(search)}&page=${page}&limit=100`
    ),

  deleteStudent: (id: string) =>
    request<{ success: boolean }>(`/admin/students/${id}`, { method: 'DELETE' }),

  getStats: () =>
    request<{ success: boolean; stats: { totalStudents: number; totalAttempts: number } }>('/admin/stats'),
};

export const quizApi = {
  getPrograms: () =>
    request<{ success: boolean; data: { name: string; questionCount: number }[] }>('/quiz/programs'),

  getQuestions: (program: string) =>
    request<{ success: boolean; program: string; questions: { id: number; questionText: string; options: string[]; correctIndex?: number }[] }>(
      `/quiz/programs/${encodeURIComponent(program)}/questions`
    ),

  submitAttempt: (program: string, answers: Record<number, number>) =>
    request<{ success: boolean; attempt: Record<string, unknown>; result: { correct: number; wrong: number; scorePercent: number; couponCode: string; generatedTime: string } }>(
      '/quiz/attempts',
      { method: 'POST', body: JSON.stringify({ program, answers }) }
    ),

  getAttempts: (program = 'All', page = 1) =>
    request<{ success: boolean; data: Record<string, unknown>[] }>(
      `/quiz/attempts?program=${encodeURIComponent(program)}&page=${page}&limit=100`
    ),

  getLatestAttempt: () =>
    request<{ success: boolean; attempt: Record<string, unknown> | null }>('/quiz/attempts/me/latest'),

  getAdminQuestions: () =>
    request<{ success: boolean; data: Record<string, { id: number; questionText: string; options: string[]; correctIndex: number }[]> }>(
      '/quiz/admin/questions'
    ),

  replaceQuestions: (data: Record<string, { questionText: string; options: string[]; correctIndex: number }[]>) =>
    request<{ success: boolean }>('/quiz/admin/questions', {
      method: 'PUT',
      body: JSON.stringify({ data }),
    }),

  createProgram: (name: string) =>
    request<{ success: boolean }>('/quiz/admin/programs', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  deleteProgram: (name: string) =>
    request<{ success: boolean }>(`/quiz/admin/programs/${encodeURIComponent(name)}`, { method: 'DELETE' }),

  addQuestion: (program: string, payload: { questionText: string; options: string[]; correctIndex: number }) =>
    request<{ success: boolean }>(`/quiz/admin/programs/${encodeURIComponent(program)}/questions`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateQuestion: (program: string, qIndex: number, payload: { questionText: string; options: string[]; correctIndex: number }) =>
    request<{ success: boolean }>(
      `/quiz/admin/programs/${encodeURIComponent(program)}/questions/${qIndex}`,
      { method: 'PUT', body: JSON.stringify(payload) }
    ),

  deleteQuestion: (program: string, qIndex: number) =>
    request<{ success: boolean }>(
      `/quiz/admin/programs/${encodeURIComponent(program)}/questions/${qIndex}`,
      { method: 'DELETE' }
    ),
};
