const API_BASE = import.meta.env.VITE_API_URL || 'https://api.erphubtechnologies.in/api';

export function getUploadUrl(uploadPath: string): string {
  if (uploadPath.startsWith('http://') || uploadPath.startsWith('https://')) {
    return uploadPath;
  }
  const base = API_BASE.replace(/\/api\/?$/, '');
  return `${base}${uploadPath.startsWith('/') ? uploadPath : `/${uploadPath}`}`;
}

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
  const hasBody = options.body != null && options.body !== '';

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set JSON content-type when sending a body (avoids DELETE/GET auth issues on some servers)
  if (hasBody && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data: { message?: string };
  try {
    data = await res.json();
  } catch {
    const err = new Error(`Request failed (${res.status})`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

async function uploadRequest<T>(path: string, formData: FormData, method = 'POST'): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { method, headers, body: formData });

  let data: { message?: string };
  try {
    data = await res.json();
  } catch {
    const err = new Error(`Request failed (${res.status})`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(data.message || `Request failed (${res.status})`) as Error & { status?: number };
    err.status = res.status;
    throw err;
  }
  return data as T;
}

export function isAuthError(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  return status === 401 || status === 403;
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

export interface StudentProgress {
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  paymentAmount: number | null;
  paymentPaidAt: string | null;
  enrolledProgram: string | null;
  scholarshipCodeUsed: string | null;
  quizCompleted: boolean;
  quizProgram: string | null;
  quizScore: number | null;
  scholarship: {
    active: boolean;
    code: string | null;
    expiresAt: string | null;
  };
  pricing: {
    standard: number;
    scholarship: number;
    applicable: number;
  };
  modules: { id: number; title: string; duration: string; description: string }[];
  certificationEligible: boolean;
  modulesUnlocked: boolean;
  paymentSubmission?: {
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    billingName?: string;
    billingEmail?: string;
    billingAddress?: string;
    transactionId?: string;
    amount?: number;
    useScholarship?: boolean;
    rejectionReason?: string;
  } | null;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  description?: string;
  program?: string;
  startDate: string;
  endDate?: string;
  fileUrl?: string;
  fileName?: string;
  uploadedAt: string;
}

export interface PaymentSubmitPayload {
  billingName: string;
  billingEmail: string;
  billingAddress: string;
  mobile: string;
  transactionId: string;
  useScholarship: boolean;
  amount: number;
  notes?: string;
  screenshot: File;
}

export interface PaymentSubmissionRecord {
  id: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentMobile: string;
  billingName: string;
  billingEmail: string;
  billingAddress: string;
  mobile: string;
  transactionId: string;
  amount: number;
  useScholarship: boolean;
  program: string;
  notes: string | null;
  screenshotUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface SupportRequestRecord {
  id: string;
  userId: string;
  studentName?: string;
  studentEmail?: string;
  studentMobile?: string;
  category: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  updatedAt: string;
}


export const studentApi = {
  getProgress: () =>
    request<{ success: boolean; progress: StudentProgress }>('/student/progress'),

  confirmPayment: (useScholarship: boolean) =>
    request<{ success: boolean; message: string }>('/student/payment/confirm', {
      method: 'POST',
      body: JSON.stringify({ useScholarship }),
    }),

  submitPayment: (payload: PaymentSubmitPayload) => {
    const formData = new FormData();
    formData.append('billingName', payload.billingName);
    formData.append('billingEmail', payload.billingEmail);
    formData.append('billingAddress', payload.billingAddress);
    formData.append('mobile', payload.mobile);
    formData.append('transactionId', payload.transactionId);
    formData.append('useScholarship', String(payload.useScholarship));
    formData.append('amount', String(payload.amount));
    if (payload.notes) formData.append('notes', payload.notes);
    formData.append('screenshot', payload.screenshot);
    return uploadRequest<{ success: boolean; message: string }>('/student/payment/submit', formData);
  },

  getSchedule: () =>
    request<{ success: boolean; data: ScheduleEntry[] }>('/student/schedule'),

  getSupportRequests: () =>
    request<{ success: boolean; data: SupportRequestRecord[] }>('/student/support'),

  submitSupportRequest: (category: string, subject: string, message: string) =>
    request<{ success: boolean; message: string; data: SupportRequestRecord }>('/student/support', {
      method: 'POST',
      body: JSON.stringify({ category, subject, message }),
    }),
};

export const adminApi = {
  getStudents: (search = '', page = 1, limit = 10) =>
    request<{
      success: boolean;
      data: Record<string, unknown>[];
      pagination: { total: number; page: number; limit: number; totalPages: number };
    }>(`/admin/students?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`),

  deleteStudent: (id: string) =>
    request<{ success: boolean }>(`/admin/students/${id}`, { method: 'DELETE' }),

  getStats: () =>
    request<{ success: boolean; stats: { totalStudents: number; totalAttempts: number; pendingPayments?: number } }>('/admin/stats'),

  getPayments: (status = 'pending', page = 1, limit = 10) =>
    request<{
      success: boolean;
      data: PaymentSubmissionRecord[];
      pagination: { total: number; page: number; limit: number; pages: number; totalPages: number };
    }>(`/admin/payments?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`),

  approvePayment: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/payments/${id}/approve`, { method: 'POST' }),

  rejectPayment: (id: string, reason?: string) =>
    request<{ success: boolean; message: string }>(`/admin/payments/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  getSchedule: () =>
    request<{ success: boolean; data: ScheduleEntry[] }>('/admin/schedule'),

  uploadSchedule: (payload: {
    title: string;
    description?: string;
    program?: string;
    startDate: string;
    endDate?: string;
    file?: File;
  }) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    if (payload.program) formData.append('program', payload.program);
    formData.append('startDate', payload.startDate);
    if (payload.endDate) formData.append('endDate', payload.endDate);
    if (payload.file) formData.append('file', payload.file);
    return uploadRequest<{ success: boolean; message: string }>('/admin/schedule', formData);
  },

  deleteSchedule: (id: string) =>
    request<{ success: boolean }>(`/admin/schedule/${id}`, { method: 'DELETE' }),

  getSupportRequests: (status = 'all', page = 1, limit = 10) =>
    request<{
      success: boolean;
      data: SupportRequestRecord[];
      pagination: { total: number; page: number; limit: number; pages: number; totalPages: number };
    }>(`/admin/support?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`),

  resolveSupportRequest: (id: string) =>
    request<{ success: boolean; message: string }>(`/admin/support/${id}/resolve`, { method: 'POST' }),
};

export const quizApi = {
  getPrograms: () =>
    request<{ success: boolean; data: { name: string; questionCount: number }[] }>('/quiz/programs'),

  getQuestions: (program: string) =>
    request<{ success: boolean; program: string; questions: { id: number; questionText: string; options: string[]; correctIndex?: number }[] }>(
      `/quiz/programs/${encodeURIComponent(program)}/questions`
    ),

  submitAttempt: (program: string, answers: Record<number, number>) =>
    request<{
      success: boolean;
      attempt: Record<string, unknown>;
      result: {
        correct: number;
        wrong: number;
        scorePercent: number;
        couponCode: string | null;
        generatedTime: string;
        scholarshipEarned: boolean;
        attemptCount: number;
        maxAttempts: number;
        canRetake: boolean;
        passPercentRequired: number;
      };
    }>(
      '/quiz/attempts',
      { method: 'POST', body: JSON.stringify({ program, answers }) }
    ),

  getAttempts: (program = 'All', page = 1, limit = 10) =>
    request<{
      success: boolean;
      data: Record<string, unknown>[];
      pagination: { total: number; page: number; limit: number; pages: number; totalPages?: number };
    }>(`/quiz/attempts?program=${encodeURIComponent(program)}&page=${page}&limit=${limit}`),

  getLatestAttempt: () =>
    request<{
      success: boolean;
      attempt: Record<string, unknown> | null;
      passingAttempt: Record<string, unknown> | null;
      attemptCount: number;
      maxAttempts: number;
      canRetake: boolean;
      scholarshipEarned: boolean;
      passPercentRequired: number;
    }>('/quiz/attempts/me/latest'),

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
