import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle,
  LogOut,
  Download,
  AlertTriangle,
  Award,
  Clock,
  ChevronRight,
  PlusCircle,
  ListFilter,
  FilePlus,
  RefreshCw,
  FolderOpen,
  Trash2,
  Users,
  Search,
  Pencil,
  Menu,
  X,
  CreditCard,
  GraduationCap,
  CalendarDays,
  HelpCircle,
} from 'lucide-react';
import type { Question } from '../data/questions';
import {
  authApi,
  adminApi,
  quizApi,
  studentApi,
  getAuthUser,
  getToken,
  setAuth,
  clearAuth,
  isAuthError,
  getUploadUrl,
  type AuthUser,
  type StudentProgress,
  type PaymentSubmissionRecord,
  type ScheduleEntry,
} from '../api/client';
import AdminPaymentsPanel, { PAYMENTS_PAGE_SIZE } from '../components/admin/AdminPaymentsPanel';
import {
  StudentPaymentTab,
  StudentCertificationTab,
  StudentScheduleTab,
} from '../components/student/StudentLearnerTabs';
import StudentSupportTab from '../components/student/StudentSupportTab';
import AdminSupportPanel from '../components/admin/AdminSupportPanel';

interface QuizAttempt {
  id: string;
  candidateName: string;
  program: string;
  score: number;
  totalQuestions: number;
  couponCode: string;
  generatedAt: string; // ISO string
  status: string; // 'completed'
}

interface RegisteredStudent {
  id: string;
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
  registeredAt: string;
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  quizAttended: boolean;
  quizProgram: string | null;
  quizScore: number | null;
  quizTotalQuestions: number | null;
  quizCouponCode: string | null;
  quizAttemptedAt: string | null;
}

const STUDENTS_PAGE_SIZE = 10;
const ATTEMPTS_PAGE_SIZE = 10;

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 1) return total === 0 ? [] : [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const items: (number | 'ellipsis')[] = [];
  const push = (value: number | 'ellipsis') => {
    if (items[items.length - 1] !== value) items.push(value);
  };

  push(1);
  if (current > 3) push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page += 1) push(page);

  if (current < total - 2) push('ellipsis');
  push(total);
  return items;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const isAdmin = authUser?.role === 'admin';
  type StudentTab = 'dashboard' | 'quiz' | 'payment' | 'certification' | 'schedule' | 'support';
  const [activeTab, setActiveTab] = useState<StudentTab>('dashboard');

  // --- Admin Navigation Sub-Tabs ---
  // 'attempts' or 'students' or 'programs' or 'quizzes'
  const [adminSubTab, setAdminSubTab] = useState<'attempts' | 'students' | 'programs' | 'quizzes' | 'schedule' | 'payments' | 'support'>('attempts');

  // --- Quiz Flow States ---
  const [quizStatus, setQuizStatus] = useState<'selection' | 'assessment' | 'result'>('selection');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [startedQuiz, setStartedQuiz] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // questionIndex -> optionIndex
  const [quizResult, setQuizResult] = useState<{
    correct: number;
    wrong: number;
    scorePercent: number;
    couponCode: string;
    generatedTime: string;
    scholarshipEarned: boolean;
    canRetake: boolean;
    attemptCount: number;
    maxAttempts: number;
    passPercentRequired: number;
  } | null>(null);

  const [countdown, setCountdown] = useState<string>('');

  // --- Stateful Questions database (admin) ---
  const [activeQuestions, setActiveQuestions] = useState<Record<string, Question[]>>({});
  const [programList, setProgramList] = useState<{ name: string; questionCount: number }[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  // --- Manage Programs & Quizzes Admin Forms ---
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [targetProgramForQuestion, setTargetProgramForQuestion] = useState<string>('');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // --- Attempts List State (for Admin) ---
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [adminProgramFilter, setAdminProgramFilter] = useState<string>('All');
  const [attemptsPage, setAttemptsPage] = useState<number>(1);

  // --- Registered Students State (for Admin) ---
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [debouncedStudentSearch, setDebouncedStudentSearch] = useState<string>('');
  const [studentsPage, setStudentsPage] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isStudentsLoading, setIsStudentsLoading] = useState(false);
  const [isAttemptsLoading, setIsAttemptsLoading] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studentProgress, setStudentProgress] = useState<StudentProgress | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [adminScheduleEntries, setAdminScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDescription, setScheduleDescription] = useState('');
  const [scheduleProgram, setScheduleProgram] = useState('');
  const [scheduleStartDate, setScheduleStartDate] = useState('');
  const [scheduleEndDate, setScheduleEndDate] = useState('');
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [isUploadingSchedule, setIsUploadingSchedule] = useState(false);
  const [paymentSubmissions, setPaymentSubmissions] = useState<PaymentSubmissionRecord[]>([]);
  const [totalPayments, setTotalPayments] = useState(0);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [isPaymentsLoading, setIsPaymentsLoading] = useState(false);
  const [reviewingPaymentId, setReviewingPaymentId] = useState<string | null>(null);

  const mapAttempt = (a: Record<string, unknown>): QuizAttempt => ({
    id: String(a.id),
    candidateName: String(a.candidateName),
    program: String(a.program),
    score: Number(a.score),
    totalQuestions: Number(a.totalQuestions),
    couponCode: a.couponCode ? String(a.couponCode) : '',
    generatedAt: new Date(String(a.generatedAt)).toISOString(),
    status: String(a.status || 'completed'),
  });

  const mapQuizResultFromAttempt = (
    att: Record<string, unknown>,
    meta: {
      scholarshipEarned: boolean;
      canRetake: boolean;
      attemptCount: number;
      maxAttempts: number;
      passPercentRequired: number;
    },
    scholarshipCode?: string
  ) => {
    const score = Number(att.score);
    const total = Number(att.totalQuestions);
    const generatedTime = new Date(String(att.generatedAt)).toISOString();
    return {
      correct: score,
      wrong: total - score,
      scorePercent: Math.round((score / total) * 100),
      couponCode: scholarshipCode || (att.couponCode ? String(att.couponCode) : ''),
      generatedTime,
      scholarshipEarned: meta.scholarshipEarned,
      canRetake: meta.canRetake,
      attemptCount: meta.attemptCount,
      maxAttempts: meta.maxAttempts,
      passPercentRequired: meta.passPercentRequired,
    };
  };

  const mapStudent = (s: Record<string, unknown>): RegisteredStudent => ({
    id: String(s.id),
    fullName: String(s.fullName),
    email: String(s.email),
    mobile: String(s.mobile),
    dob: String(s.dob),
    gender: String(s.gender),
    aadhaar: String(s.aadhaar),
    address: String(s.address || ''),
    college: String(s.college),
    studentStatus: String(s.studentStatus),
    workStatus: String(s.workStatus),
    reason: String(s.reason || ''),
    registeredAt: new Date(String(s.registeredAt)).toISOString(),
    paymentStatus: s.paymentStatus ? (s.paymentStatus as 'unpaid' | 'pending' | 'paid') : 'unpaid',
    quizAttended: Boolean(s.quizAttended),
    quizProgram: s.quizProgram ? String(s.quizProgram) : null,
    quizScore: s.quizScore != null ? Number(s.quizScore) : null,
    quizTotalQuestions: s.quizTotalQuestions != null ? Number(s.quizTotalQuestions) : null,
    quizCouponCode: s.quizCouponCode ? String(s.quizCouponCode) : null,
    quizAttemptedAt: s.quizAttemptedAt ? new Date(String(s.quizAttemptedAt)).toISOString() : null,
  });

  const reloadAdminData = useCallback(async () => {
    setIsStudentsLoading(true);
    setIsAttemptsLoading(true);
    try {
      const [studentsRes, attemptsRes, questionsRes, scheduleRes] = await Promise.all([
        adminApi.getStudents(debouncedStudentSearch, studentsPage, STUDENTS_PAGE_SIZE),
        quizApi.getAttempts(adminProgramFilter, attemptsPage, ATTEMPTS_PAGE_SIZE),
        quizApi.getAdminQuestions(),
        adminApi.getSchedule().catch(() => ({ success: true, data: [] as ScheduleEntry[] })),
      ]);
      setRegisteredStudents(studentsRes.data.map(mapStudent));
      setTotalStudents(studentsRes.pagination?.total ?? studentsRes.data.length);
      setAttempts(attemptsRes.data.map(mapAttempt));
      setTotalAttempts(attemptsRes.pagination?.total ?? attemptsRes.data.length);
      setActiveQuestions(questionsRes.data as Record<string, Question[]>);
      setAdminScheduleEntries(scheduleRes.data);
    } finally {
      setIsStudentsLoading(false);
      setIsAttemptsLoading(false);
    }
  }, [adminProgramFilter, debouncedStudentSearch, studentsPage, attemptsPage]);

  const loadAdminPayments = useCallback(async () => {
    setIsPaymentsLoading(true);
    try {
      const res = await adminApi.getPayments(paymentStatusFilter, paymentsPage, PAYMENTS_PAGE_SIZE);
      setPaymentSubmissions(res.data);
      setTotalPayments(res.pagination?.total ?? res.data.length);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load payments');
    } finally {
      setIsPaymentsLoading(false);
    }
  }, [paymentStatusFilter, paymentsPage]);

  const reloadStudentData = useCallback(async () => {
    const [programsRes, latestRes] = await Promise.all([
      quizApi.getPrograms(),
      quizApi.getLatestAttempt(),
    ]);
    setProgramList(programsRes.data);

    try {
      const progressRes = await studentApi.getProgress();
      setStudentProgress(progressRes.progress);
    } catch {
      setStudentProgress(null);
    }

    setScheduleLoading(true);
    try {
      const scheduleRes = await studentApi.getSchedule();
      setScheduleEntries(scheduleRes.data);
    } catch {
      setScheduleEntries([]);
    } finally {
      setScheduleLoading(false);
    }

    if (latestRes.attempt) {
      const att = latestRes.attempt;
      const meta = {
        scholarshipEarned: Boolean(latestRes.scholarshipEarned),
        canRetake: Boolean(latestRes.canRetake),
        attemptCount: Number(latestRes.attemptCount ?? 1),
        maxAttempts: Number(latestRes.maxAttempts ?? 3),
        passPercentRequired: Number(latestRes.passPercentRequired ?? 50),
      };
      const scholarshipCode = latestRes.passingAttempt?.couponCode
        ? String(latestRes.passingAttempt.couponCode)
        : '';
      setQuizResult(mapQuizResultFromAttempt(att, meta, scholarshipCode));
      setSelectedProgram(String(att.program));
      setQuizStatus('result');
    } else {
      setQuizResult(null);
      setSelectedProgram('');
      setStartedQuiz(false);
      setQuizStatus('selection');
      setUserAnswers({});
      setQuizQuestions([]);
    }
  }, []);

  // Load dashboard data from API
  useEffect(() => {
    if (!getToken()) {
      navigate('/login');
      return;
    }

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setLoadError('');
      try {
        const meRes = await authApi.me();
        if (cancelled) return;
        setAuthUser(meRes.user);
        const token = getToken();
        if (token) setAuth(token, meRes.user);
        const isAdmin = meRes.user.role === 'admin';

        if (isAdmin) {
          await reloadAdminData();
          const programsRes = await quizApi.getPrograms();
          if (!cancelled) setProgramList(programsRes.data);
        } else {
          await reloadStudentData();
        }
      } catch (err) {
        if (!cancelled) {
          if (isAuthError(err)) {
            clearAuth();
            navigate('/login');
            return;
          }
          setLoadError(err instanceof Error ? err.message : 'Failed to load dashboard');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [navigate, reloadAdminData, reloadStudentData]);

  useEffect(() => {
    if (!authUser || !isAdmin) return;
    reloadAdminData().catch((err) => {
      setLoadError(err instanceof Error ? err.message : 'Failed to refresh admin data');
    });
  }, [authUser, isAdmin, adminProgramFilter, debouncedStudentSearch, studentsPage, attemptsPage, reloadAdminData]);

  // Reset pagination pages when filters change
  useEffect(() => {
    setAttemptsPage(1);
  }, [adminProgramFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedStudentSearch(studentSearchQuery), 300);
    return () => window.clearTimeout(timer);
  }, [studentSearchQuery]);

  useEffect(() => {
    setStudentsPage(1);
  }, [debouncedStudentSearch]);

  useEffect(() => {
    setPaymentsPage(1);
  }, [paymentStatusFilter]);

  useEffect(() => {
    if (!authUser || !isAdmin || adminSubTab !== 'payments') return;
    loadAdminPayments().catch((err) => {
      setLoadError(err instanceof Error ? err.message : 'Failed to load payments');
    });
  }, [authUser, isAdmin, adminSubTab, loadAdminPayments]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const closeSidebar = () => setSidebarOpen(false);

  const goToStudentTab = (tab: StudentTab) => {
    setActiveTab(tab);
    closeSidebar();
  };

  const handleSubmitPayment = async (payload: {
    billingName: string;
    billingEmail: string;
    billingAddress: string;
    mobile: string;
    transactionId: string;
    useScholarship: boolean;
    amount: number;
    notes?: string;
    screenshot: File;
  }) => {
    setIsPaying(true);
    setLoadError('');
    try {
      await studentApi.submitPayment(payload);
      await reloadStudentData();
      alert('Payment proof submitted successfully! Our team will verify and activate your enrollment shortly.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment submission failed';
      setLoadError(message);
      throw err;
    } finally {
      setIsPaying(false);
    }
  };

  const handleUploadSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleTitle.trim() || !scheduleStartDate) {
      alert('Please enter a title and start date.');
      return;
    }
    setIsUploadingSchedule(true);
    try {
      await adminApi.uploadSchedule({
        title: scheduleTitle.trim(),
        description: scheduleDescription.trim() || undefined,
        program: scheduleProgram || undefined,
        startDate: scheduleStartDate,
        endDate: scheduleEndDate || undefined,
        file: scheduleFile ?? undefined,
      });
      await reloadAdminData();
      setScheduleTitle('');
      setScheduleDescription('');
      setScheduleProgram('');
      setScheduleStartDate('');
      setScheduleEndDate('');
      setScheduleFile(null);
      alert('Schedule uploaded successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload schedule');
    } finally {
      setIsUploadingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm('Delete this schedule entry?')) return;
    try {
      await adminApi.deleteSchedule(id);
      await reloadAdminData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete schedule');
    }
  };

  const handleApprovePayment = async (id: string) => {
    if (!window.confirm('Approve this payment? A confirmation email will be sent to the student.')) return;
    setReviewingPaymentId(id);
    try {
      await adminApi.approvePayment(id);
      await loadAdminPayments();
      alert('Payment approved. Confirmation email sent to the student.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve payment');
    } finally {
      setReviewingPaymentId(null);
    }
  };

  const handleRejectPayment = async (id: string, reason: string) => {
    setReviewingPaymentId(id);
    try {
      await adminApi.rejectPayment(id, reason);
      await loadAdminPayments();
      alert('Payment rejected. The student can resubmit payment proof.');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject payment');
    } finally {
      setReviewingPaymentId(null);
    }
  };

  // Update Countdown Live Timer
  useEffect(() => {
    if (!quizResult?.scholarshipEarned || !quizResult.couponCode) return;
    const updateTimer = () => {
      const generatedTime = new Date(quizResult.generatedTime).getTime();
      const expiryTime = generatedTime + 72 * 60 * 60 * 1000;
      const now = Date.now();
      const diff = expiryTime - now;
      if (diff <= 0) {
        setCountdown('Expired');
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [quizResult]);

  // Format Helper
  const handleStartQuiz = async () => {
    if (!selectedProgram) return;
    const prog = programList.find((p) => p.name === selectedProgram);
    if (!prog || prog.questionCount !== 10) {
      alert('This program does not have exactly 10 questions. It must be configured with 10 questions to attempt.');
      return;
    }
    try {
      const res = await quizApi.getQuestions(selectedProgram);
      setQuizQuestions(
        res.questions.map((q) => ({
          id: q.id,
          questionText: q.questionText,
          options: q.options,
          correctIndex: q.correctIndex ?? 0,
        }))
      );
      setStartedQuiz(true);
      setQuizStatus('assessment');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load quiz questions');
    }
  };

  const handleRetakeQuiz = async () => {
    if (!selectedProgram || !quizResult?.canRetake) return;
    await handleStartQuiz();
  };

  // Handle option choice click
  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  // Submit Quiz
  const handleSubmitQuiz = async () => {
    if (!quizQuestions.length) return;

    if (Object.keys(userAnswers).length < quizQuestions.length) {
      alert('Please answer all 10 questions before submitting.');
      return;
    }

    setIsSubmittingQuiz(true);
    try {
      const res = await quizApi.submitAttempt(selectedProgram, userAnswers);
      const result = {
        correct: res.result.correct,
        wrong: res.result.wrong,
        scorePercent: Math.round(res.result.scorePercent),
        couponCode: res.result.couponCode || '',
        generatedTime: new Date(String(res.result.generatedTime)).toISOString(),
        scholarshipEarned: res.result.scholarshipEarned,
        canRetake: res.result.canRetake,
        attemptCount: res.result.attemptCount,
        maxAttempts: res.result.maxAttempts,
        passPercentRequired: res.result.passPercentRequired,
      };

      setQuizResult(result);
      setQuizStatus('result');

      if (authUser?.role === 'admin') {
        await reloadAdminData();
      } else {
        await reloadStudentData();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Format Helper
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Expiry Checker
  const getScholarshipStatus = (isoString: string, hasCode = true) => {
    if (!hasCode) {
      return { expired: true, text: 'Not Earned' };
    }
    const generatedTime = new Date(isoString).getTime();
    const expiryTime = generatedTime + 72 * 60 * 60 * 1000;
    const now = Date.now();
    const remainingMs = expiryTime - now;

    if (remainingMs <= 0) {
      return { expired: true, text: 'Expired' };
    } else {
      const hoursLeft = Math.ceil(remainingMs / (1000 * 60 * 60));
      return { expired: false, text: `Active (${hoursLeft}h left)` };
    }
  };

  // CSV Export for Quiz Attempts
  const handleExportAttemptsCSV = async () => {
    try {
      const res = await quizApi.getAttempts(adminProgramFilter, 1, 10000);
      const allAttempts = res.data.map(mapAttempt);
      const csvHeaders = ['Candidate Name', 'Selected Program', 'Score', 'Scholarship Code', 'Generated At', 'Expiry Status'];
      const csvRows = allAttempts.map(att => {
        const { text } = getScholarshipStatus(att.generatedAt, !!att.couponCode);
        return [
          `"${att.candidateName}"`,
          `"${att.program}"`,
          `"${att.score}/${att.totalQuestions}"`,
          `"${att.couponCode || 'Not Earned'}"`,
          `"${formatDateTime(att.generatedAt)}"`,
          `"${text}"`
        ];
      });

      const csvContent = [csvHeaders.join(','), ...csvRows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SIDEP_Quiz_Attempts_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export attempts');
    }
  };

  // CSV Export for Registered Students
  const handleExportStudentsCSV = async () => {
    try {
      const res = await adminApi.getStudents(debouncedStudentSearch, 1, 10000);
      const allStudents = res.data.map(mapStudent);
      const csvHeaders = ['Full Name', 'Email ID', 'Mobile Number', 'Date of Birth', 'Gender', 'Aadhaar Number', 'College Name', 'Student Status', 'Working Status', 'Paid', 'Quiz Attended', 'Quiz Program', 'Quiz Score', 'Registered At'];
      const csvRows = allStudents.map(std => {
        return [
          `"${std.fullName}"`,
          `"${std.email}"`,
          `"${std.mobile}"`,
          `"${formatDob(std.dob)}"`,
          `"${std.gender}"`,
          `"${std.aadhaar}"`,
          `"${std.college}"`,
          `"${std.studentStatus}"`,
          `"${std.workStatus}"`,
          `"${std.paymentStatus === 'paid' ? 'Yes' : std.paymentStatus === 'pending' ? 'Pending' : 'No'}"`,
          `"${std.quizAttended ? 'Yes' : 'No'}"`,
          `"${std.quizProgram || '—'}"`,
          std.quizAttended && std.quizScore != null && std.quizTotalQuestions != null
            ? `"${std.quizScore}/${std.quizTotalQuestions}"`
            : '"—"',
          `"${formatDateTime(std.registeredAt)}"`
        ];
      });

      const csvContent = [csvHeaders.join(','), ...csvRows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SIDEP_Registered_Students_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export students');
    }
  };

  const handleRefreshAdminData = async () => {
    setLoadError('');
    try {
      await reloadAdminData();
      const programsRes = await quizApi.getPrograms();
      setProgramList(programsRes.data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to refresh dashboard');
    }
  };

  // ADMIN ACTION: Add Training Program
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgramName.trim()) {
      alert('Please enter a program name.');
      return;
    }
    const name = newProgramName.trim();
    if (activeQuestions[name]) {
      alert('This training program already exists.');
      return;
    }

    try {
      await quizApi.createProgram(name);
      await reloadAdminData();
      const programsRes = await quizApi.getPrograms();
      setProgramList(programsRes.data);
      setNewProgramName('');
      setTargetProgramForQuestion(name);
      alert(`Training program "${name}" created successfully. Now configure the quiz questions in the "Manage Quizzes" tab.`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create program');
    }
  };

  // ADMIN ACTION: Delete a Training Program entirely
  const handleDeleteProgram = async (progName: string) => {
    if (!window.confirm(`Are you sure you want to delete the program "${progName}"? This will delete all its questions.`)) return;
    try {
      await quizApi.deleteProgram(progName);
      await reloadAdminData();
      const programsRes = await quizApi.getPrograms();
      setProgramList(programsRes.data);
      if (targetProgramForQuestion === progName) {
        setTargetProgramForQuestion('');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete program');
    }
  };

  const resetQuestionForm = () => {
    setEditingQuestionIndex(null);
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setCorrectOptionIdx(0);
  };

  // ADMIN ACTION: Add or update Quiz Question
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProgramForQuestion) {
      alert('Please select a training program.');
      return;
    }
    if (!newQuestionText.trim()) {
      alert('Please enter the question text.');
      return;
    }
    if (newOptions.some(opt => !opt.trim())) {
      alert('Please fill out all 4 option fields.');
      return;
    }

    const programQs = activeQuestions[targetProgramForQuestion] || [];
    const isEditing = editingQuestionIndex !== null;

    if (!isEditing && programQs.length >= 10) {
      alert('This quiz already has 10 questions. Delete or clear questions to add new ones.');
      return;
    }

    const payload = {
      questionText: newQuestionText.trim(),
      options: newOptions.map((o) => o.trim()),
      correctIndex: correctOptionIdx,
    };

    try {
      if (isEditing) {
        await quizApi.updateQuestion(targetProgramForQuestion, editingQuestionIndex, payload);
        alert('Question updated successfully!');
      } else {
        await quizApi.addQuestion(targetProgramForQuestion, payload);
        alert(`Question added successfully! (${programQs.length + 1} of 10)`);
      }
      await reloadAdminData();
      resetQuestionForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'add'} question`);
    }
  };

  const handleStartEditQuestion = (progName: string, qIndex: number) => {
    const q = activeQuestions[progName]?.[qIndex];
    if (!q) return;
    setTargetProgramForQuestion(progName);
    setEditingQuestionIndex(qIndex);
    setNewQuestionText(q.questionText);
    setNewOptions([...q.options]);
    setCorrectOptionIdx(q.correctIndex);
  };

  // ADMIN ACTION: Delete a student registration
  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Are you sure you want to remove this registered student record?')) return;

    if (!getToken()) {
      clearAuth();
      navigate('/login');
      return;
    }

    setDeletingStudentId(studentId);
    try {
      const meRes = await authApi.me();
      const token = getToken();
      if (token) setAuth(token, meRes.user);
      setAuthUser(meRes.user);

      await adminApi.deleteStudent(studentId);

      if (registeredStudents.length === 1 && studentsPage > 1) {
        setStudentsPage((page) => page - 1);
      } else {
        await reloadAdminData();
      }
    } catch (err) {
      if (isAuthError(err)) {
        clearAuth();
        navigate('/login');
        return;
      }
      alert(err instanceof Error ? err.message : 'Failed to delete student');
    } finally {
      setDeletingStudentId(null);
    }
  };

  // ADMIN ACTION: Delete a single quiz question
  const handleDeleteQuestion = async (progName: string, qIndex: number) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await quizApi.deleteQuestion(progName, qIndex);
      if (editingQuestionIndex === qIndex && targetProgramForQuestion === progName) {
        resetQuestionForm();
      } else if (editingQuestionIndex !== null && targetProgramForQuestion === progName && editingQuestionIndex > qIndex) {
        setEditingQuestionIndex(editingQuestionIndex - 1);
      }
      await reloadAdminData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete question');
    }
  };

  // ADMIN ACTION: Quick mock generate questions (for testing convenience)
  const handleQuickGenerateMock = async (progName: string) => {
    const count = activeQuestions[progName]?.length || 0;
    if (count >= 10) {
      alert('Program already has 10 or more questions.');
      return;
    }

    const needed = 10 - count;
    const generated: Question[] = [];
    for (let i = 1; i <= needed; i++) {
      generated.push({
        id: Date.now() + i,
        questionText: `What is standard assessment review practice question #${count + i} for ${progName}?`,
        options: [
          `Primary optimization execution rule #${i}`,
          `Strategic integration parameter #${i}`,
          `Secondary validation configuration #${i}`,
          `Alternative database interface #${i}`,
        ],
        correctIndex: i % 4,
      });
    }

    const updated = {
      ...activeQuestions,
      [progName]: [...(activeQuestions[progName] || []), ...generated],
    };

    try {
      await quizApi.replaceQuestions(
        Object.fromEntries(
          Object.entries(updated).map(([name, questions]) => [
            name,
            questions.map(({ questionText, options, correctIndex }) => ({
              questionText,
              options,
              correctIndex,
            })),
          ])
        )
      );
      await reloadAdminData();
      alert(`Instantly generated ${needed} questions for "${progName}". It is now ready for candidate validation tests!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate questions');
    }
  };

  // ADMIN ACTION: Clear all questions inside a program
  const handleClearProgramQuestions = async (progName: string) => {
    if (!window.confirm(`Are you sure you want to clear all questions for "${progName}"?`)) return;
    const updated = { ...activeQuestions, [progName]: [] };
    try {
      await quizApi.replaceQuestions(
        Object.fromEntries(
          Object.entries(updated).map(([name, questions]) => [
            name,
            questions.map(({ questionText, options, correctIndex }) => ({
              questionText,
              options,
              correctIndex,
            })),
          ])
        )
      );
      await reloadAdminData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to clear questions');
    }
  };

  // --- Pagination Variables ---
  const attemptsPageSize = ATTEMPTS_PAGE_SIZE;
  const totalAttemptsPages = Math.max(1, Math.ceil(totalAttempts / attemptsPageSize));
  const attemptsShowingFrom = totalAttempts === 0 ? 0 : (attemptsPage - 1) * attemptsPageSize + 1;
  const attemptsShowingTo = Math.min(attemptsPage * attemptsPageSize, totalAttempts);
  const attemptPageNumbers = buildPageList(attemptsPage, totalAttemptsPages);

  const studentsPageSize = STUDENTS_PAGE_SIZE;
  const totalStudentsPages = Math.max(1, Math.ceil(totalStudents / studentsPageSize));
  const studentsShowingFrom = totalStudents === 0 ? 0 : (studentsPage - 1) * studentsPageSize + 1;
  const studentsShowingTo = Math.min(studentsPage * studentsPageSize, totalStudents);
  const studentPageNumbers = buildPageList(studentsPage, totalStudentsPages);

  const userInitials = authUser?.fullName
    ? authUser.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  const firstName = authUser?.fullName?.split(' ')[0] || 'Learner';

  const studentPageMeta: Record<StudentTab, { title: string; subtitle: string; mobile: string }> = {
    dashboard: {
      title: `Welcome back, ${firstName}!`,
      subtitle: 'Digital Empowerment & Skill Validation Hub.',
      mobile: `Hi, ${firstName}`,
    },
    quiz: {
      title: 'SIDEP Assessment',
      subtitle: 'Complete your skills validation assessment.',
      mobile: 'SIDEP Assessment',
    },
    payment: {
      title: 'Program Payment',
      subtitle: 'Pay via bank transfer or UPI, then submit your payment proof for verification.',
      mobile: 'Program Payment',
    },
    certification: {
      title: 'Certification',
      subtitle: 'Your SIDEP program certificate and enrollment credentials.',
      mobile: 'Certification',
    },
    schedule: {
      title: 'Schedule Calendar',
      subtitle: 'Training sessions, class dates, and downloadable schedule files.',
      mobile: 'Schedule',
    },
    support: {
      title: 'Support Desk',
      subtitle: 'Submit support tickets and view assistance history.',
      mobile: 'Support',
    },
  };

  const paymentFormDefaults = {
    fullName: authUser?.fullName || '',
    email: authUser?.email || '',
    mobile: authUser?.mobile || '',
    address: authUser?.address || '',
  };

  const learnerTabProps = studentProgress
    ? {
        progress: studentProgress,
        scholarshipCountdown: countdown,
        isPaying,
        onPay: () => {},
        onGoToQuiz: () => goToStudentTab('quiz'),
        onGoToPayment: () => goToStudentTab('payment'),
        formDefaults: paymentFormDefaults,
        onSubmitPayment: handleSubmitPayment,
      }
    : null;

  const formatMobile = (mobile?: string) => {
    if (!mobile) return '—';
    const digits = mobile.replace(/\D/g, '');
    if (digits.length === 10) return `+91 ${digits}`;
    return mobile;
  };
  const formatDob = (dob?: string) => {
    if (!dob) return '—';
    const d = new Date(dob);
    return Number.isNaN(d.getTime()) ? dob : d.toLocaleDateString('en-IN');
  };

  const canStartQuiz =
    !!selectedProgram &&
    (programList.find((p) => p.name === selectedProgram)?.questionCount ?? 0) === 10 &&
    (!quizResult || quizResult.canRetake) &&
    !quizResult?.scholarshipEarned;

  if (isLoading) {
    return (
      <div className="dash-layout" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      {/* Mobile top bar */}
      <header className="dash-mobile-header">
        <button
          type="button"
          className="dash-mobile-menu-btn"
          onClick={() => setSidebarOpen((open) => !open)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="dash-mobile-title">
          <span className="dash-mobile-brand">ERP Digital Portal</span>
          <span className="dash-mobile-subtitle">
            {isAdmin ? 'Admin Dashboard' : studentPageMeta[activeTab].mobile}
          </span>
        </div>
      </header>

      {/* Sidebar overlay (mobile) */}
      <div
        className={`dash-sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sidebar Navigation */}
      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dash-sidebar-header">
          <h2 style={{ color: '#FFB800', margin: 0, fontSize: '20px', fontWeight: 800 }}>ERP Digital Portal</h2>
          <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.5px' }}>
            {isAdmin ? 'ADMIN SPACE' : 'LEARNER SPACE'}
          </span>
        </div>

        <nav className="dash-sidebar-menu">
          {isAdmin ? (
            <>
              <button
                className={`dash-menu-item ${adminSubTab === 'attempts' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('attempts'); closeSidebar(); }}
              >
                <ListFilter size={18} />
                Learner Attempts
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'students' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('students'); closeSidebar(); }}
              >
                <Users size={18} />
                Registered Students
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'programs' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('programs'); closeSidebar(); }}
              >
                <FolderOpen size={18} />
                Manage Programs
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'quizzes' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('quizzes'); closeSidebar(); }}
              >
                <PlusCircle size={18} />
                Manage Quizzes
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'payments' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('payments'); closeSidebar(); }}
              >
                <CreditCard size={18} />
                Payment Reviews
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'schedule' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('schedule'); closeSidebar(); }}
              >
                <CalendarDays size={18} />
                Manage Schedule
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'support' ? 'active' : ''}`}
                onClick={() => { setAdminSubTab('support'); closeSidebar(); }}
              >
                <HelpCircle size={18} />
                Support Requests
              </button>
            </>
          ) : (
            <>
              <button
                className={`dash-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => goToStudentTab('dashboard')}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => goToStudentTab('quiz')}
              >
                <BookOpen size={18} />
                Quiz
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => goToStudentTab('payment')}
              >
                <CreditCard size={18} />
                Payment
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => goToStudentTab('schedule')}
              >
                <CalendarDays size={18} />
                Schedule
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'certification' ? 'active' : ''}`}
                onClick={() => goToStudentTab('certification')}
              >
                <GraduationCap size={18} />
                Certification
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'support' ? 'active' : ''}`}
                onClick={() => goToStudentTab('support')}
              >
                <HelpCircle size={18} />
                Support
              </button>
            </>
          )}
        </nav>

        {/* User Context bottom block */}
        <div className="dash-sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFB800', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {userInitials}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{authUser?.fullName || 'User'}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{authUser?.role === 'admin' ? 'Administrator' : 'SIDEP Candidate'}</div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => {
              clearAuth();
              navigate('/login');
            }}
            className="dash-signout-btn"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dash-content">
        {loadError && (
          <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '14px' }}>
            {loadError}
          </div>
        )}
        
        {/* Top Control Bar */}
        <div className="dash-top-bar">
          <div className="dash-top-bar-text">
            <h1 className="dash-page-title">
              {isAdmin ? 'Admin Dashboard' : studentPageMeta[activeTab].title}
            </h1>
            <p className="dash-page-subtitle">
              {isAdmin
                ? 'Monitor quiz attempts, track registered students, configure training programs, and authorize evaluation quizzes.'
                : studentPageMeta[activeTab].subtitle}
            </p>
          </div>

          <div className="dash-top-bar-actions">
            {isAdmin ? (
              <button
                type="button"
                onClick={handleRefreshAdminData}
                className="dash-refresh-btn"
                title="Refresh admin dashboard"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setLoadError('');
                  try {
                    const meRes = await authApi.me();
                    setAuthUser(meRes.user);
                    const token = getToken();
                    if (token) setAuth(token, meRes.user);
                    await reloadStudentData();
                  } catch (err) {
                    setLoadError(err instanceof Error ? err.message : 'Failed to refresh dashboard');
                  }
                }}
                className="dash-refresh-btn"
                title="Refresh dashboard from server"
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* ---------------- STUDENT MODE ---------------- */}
        {!isAdmin && (
          <>
            {/* TABS: DASHBOARD CONTENT */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Grid */}
                <div className="dash-grid-3" style={{ marginBottom: '32px' }}>
                  <div className="dash-card dash-stat-card">
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>Program Status</span>
                      <strong style={{ fontSize: '20px', fontWeight: 800 }}>
                        {quizResult
                          ? quizResult.scholarshipEarned
                            ? 'Assessment Completed'
                            : quizResult.canRetake
                              ? `Attempt ${quizResult.attemptCount}/${quizResult.maxAttempts}`
                              : 'Attempts Exhausted'
                          : 'Enrolled'}
                      </strong>
                    </div>
                  </div>

                  <div className="dash-card dash-stat-card">
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>Assessment Score</span>
                      <strong style={{ fontSize: '20px', fontWeight: 800 }}>
                        {quizResult ? `${quizResult.correct}/10 (${quizResult.scorePercent}%)` : 'Not Attempted'}
                      </strong>
                    </div>
                  </div>

                  <div className="dash-card dash-stat-card">
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>Scholarship Status</span>
                      <strong style={{ fontSize: '20px', fontWeight: 800 }}>
                        {!quizResult
                          ? 'No Scholarship Generated'
                          : quizResult.scholarshipEarned && quizResult.couponCode
                            ? getScholarshipStatus(quizResult.generatedTime, true).text
                            : 'Not Earned'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Panel */}
                <div className="dash-card dash-overview-card">
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>SIDEP Candidate Overview</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Welcome to the Social Initiative & Digital Empowerment Program candidate portal. Use this portal to complete your skills validation assessment.
                  </p>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>My Registration Details</h4>
                    <div className="dash-details-grid">
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>EMAIL ID</span>
                        <strong>{authUser?.email || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>MOBILE NUMBER</span>
                        <strong>{formatMobile(authUser?.mobile)}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>EDUCATION STATUS</span>
                        <strong>{authUser?.studentStatus || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>COLLEGE / INSTITUTION</span>
                        <strong>{authUser?.college || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>DATE OF BIRTH</span>
                        <strong>{formatDob(authUser?.dob)}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>WORK STATUS</span>
                        <strong>{authUser?.workStatus || '—'}</strong>
                      </div>
                    </div>
                  </div>

                  {quizResult?.scholarshipEarned && quizResult.couponCode && (
                    <div className="dash-grid-2" style={{ marginTop: '32px' }}>
                      {/* Left container: Active Scholarship Status */}
                      <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                            <Award style={{ color: '#FFB800' }} size={20} />
                            Your Active Scholarship Status
                          </h4>
                          <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>
                            You completed the <strong>{selectedProgram}</strong> assessment. Here is your digital empowerment scholarship. Our team will contact you shortly.
                          </p>
                          
                          <div style={{ display: 'inline-flex', alignItems: 'center', background: '#0f172a', padding: '12px 24px', borderRadius: '8px', border: '1px dashed #FFB800', color: '#FFB800', fontWeight: '800', fontSize: '20px', letterSpacing: '1px', marginBottom: '16px' }}>
                            {quizResult.couponCode}
                          </div>

                          <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} />
                              <span>Generated on: <strong>{formatDateTime(quizResult.generatedTime)}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={14} style={{ color: '#ef4444' }} />
                              <span>Remaining Time: <strong style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '14px' }}>{countdown}</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right container: Payment & Enrollment Status */}
                      <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                            <CreditCard style={{ color: '#0284c7' }} size={20} />
                            Program Payment &amp; Enrollment
                          </h4>
                          
                          {studentProgress?.paymentStatus === 'paid' ? (
                            <>
                              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>
                                Your enrollment has been verified. You now have full access to the program calendar and training modules.
                              </p>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#dcfce7', color: '#16a34a', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>
                                <CheckCircle size={16} /> Paid &amp; Enrolled
                              </div>
                              <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div>Course: <strong>{studentProgress.enrolledProgram}</strong></div>
                                <div>Amount Paid: <strong>{formatCurrency(studentProgress.paymentAmount ?? 0)}</strong></div>
                              </div>
                            </>
                          ) : studentProgress?.paymentStatus === 'pending' || studentProgress?.paymentSubmission?.status === 'pending' ? (
                            <>
                              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>
                                Your payment proof is currently under review. Our team will verify the bank transaction reference and approve your access shortly.
                              </p>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fef3c7', color: '#d97706', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>
                                <Clock size={16} /> Under Review
                              </div>
                              <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div>Transaction ID: <strong>{studentProgress?.paymentSubmission?.transactionId || '—'}</strong></div>
                                <div>Amount Submitted: <strong>{studentProgress?.paymentSubmission?.amount != null ? formatCurrency(studentProgress.paymentSubmission.amount) : '—'}</strong></div>
                              </div>
                            </>
                          ) : (
                            <>
                              <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>
                                Complete your payment to claim your scholarship discount and unlock access to the training sessions.
                              </p>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#ef4444', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', marginBottom: '16px' }}>
                                <AlertTriangle size={16} /> Unpaid
                              </div>
                              <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div>Standard Fee: <span style={{ textDecoration: 'line-through' }}>{formatCurrency(studentProgress?.pricing?.standard ?? 15000)}</span></div>
                                <div>Scholarship Fee: <strong style={{ color: '#16a34a' }}>{formatCurrency(studentProgress?.pricing?.scholarship ?? 7500)}</strong></div>
                              </div>
                            </>
                          )}
                        </div>

                        {studentProgress?.paymentStatus !== 'paid' && studentProgress?.paymentStatus !== 'pending' && studentProgress?.paymentSubmission?.status !== 'pending' && (
                          <button
                            type="button"
                            onClick={() => setActiveTab('payment')}
                            className="dash-alert-action-btn"
                            style={{ marginTop: '16px', alignSelf: 'flex-start', background: '#0284c7', borderColor: '#0284c7', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            Make Payment <ChevronRight size={14} style={{ marginLeft: '4px' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {!quizResult && (
                    <div className="dash-alert-banner">
                      <div className="dash-alert-banner-content">
                        <AlertTriangle style={{ color: '#d97706' }} size={24} />
                        <div>
                          <strong style={{ color: '#92400e', fontSize: '14px' }}>Skills Assessment Pending</strong>
                          <span style={{ display: 'block', fontSize: '13px', color: '#b45309' }}>
                            Score 50% or higher to unlock your scholarship code. Up to 3 attempts allowed.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('quiz')}
                        className="dash-alert-action-btn"
                      >
                        Take Quiz <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {quizResult && !quizResult.scholarshipEarned && quizResult.canRetake && (
                    <div className="dash-alert-banner">
                      <div className="dash-alert-banner-content">
                        <AlertTriangle style={{ color: '#d97706' }} size={24} />
                        <div>
                          <strong style={{ color: '#92400e', fontSize: '14px' }}>Scholarship Not Earned Yet</strong>
                          <span style={{ display: 'block', fontSize: '13px', color: '#b45309' }}>
                            You scored {quizResult.scorePercent}% (need {quizResult.passPercentRequired}%+). Retake {quizResult.maxAttempts - quizResult.attemptCount} more time{quizResult.maxAttempts - quizResult.attemptCount === 1 ? '' : 's'} to earn your scholarship.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setActiveTab('quiz'); handleRetakeQuiz(); }}
                        className="dash-alert-action-btn"
                      >
                        Retake Quiz <ChevronRight size={14} />
                      </button>
                    </div>
                  )}

                  {quizResult && !quizResult.scholarshipEarned && !quizResult.canRetake && (
                    <div style={{ marginTop: '32px', background: '#fef2f2', padding: '20px', borderRadius: '12px', border: '1px solid #fecaca' }}>
                      <strong style={{ color: '#991b1b', fontSize: '14px' }}>Maximum Attempts Reached</strong>
                      <p style={{ color: '#b91c1c', fontSize: '13px', margin: '8px 0 0' }}>
                        You used all {quizResult.maxAttempts} attempts without reaching {quizResult.passPercentRequired}%. You may still enroll with the standard fee.
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TABS: QUIZ CONTENT */}
            {activeTab === 'quiz' && (
              <div>
                {/* Step 1: Program Selection */}
                {quizStatus === 'selection' && (
                  <div className="dash-card dash-quiz-selection-panel">
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Select Your Training Program</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                      Choose the training program you want to validate. Score <strong>{quizResult?.passPercentRequired ?? 50}% or higher</strong> to earn your scholarship code. You get up to <strong>3 attempts</strong>.
                      {quizResult && quizResult.attemptCount > 0 && (
                        <> Your program <strong>{selectedProgram}</strong> is locked for remaining attempts.</>
                      )}
                    </p>

                    <div className="quiz-program-grid">
                      {programList.map(({ name: programName, questionCount: qCount }) => {
                        const isSelected = selectedProgram === programName;
                        const programLocked = !!quizResult && quizResult.attemptCount > 0;
                        return (
                          <div
                            key={programName}
                            className={`program-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (!startedQuiz && !programLocked) {
                                setSelectedProgram(programName);
                              }
                            }}
                            style={programLocked && !isSelected ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                          >
                            <BookOpen size={24} style={{ color: isSelected ? '#FFB800' : '#64748b', margin: '0 auto 12px' }} />
                            <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0' }}>{programName}</h4>
                            <span style={{ fontSize: '12px', color: qCount === 10 ? '#16a34a' : '#ea580c', fontWeight: 600 }}>
                              {qCount === 10 ? '10 Questions' : `${qCount}/10 Questions (Draft)`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 2: Quiz Assessment */}
                {quizStatus === 'assessment' && (
                  <div className="dash-card">
                    <div className="dash-quiz-header">
                      <div>
                        <strong style={{ fontSize: '18px', display: 'block' }}>{selectedProgram} Assessment</strong>
                        <span style={{ fontSize: '13px', color: '#64748b' }}>
                          Question {currentQuestionIndex + 1} of 10
                        </span>
                      </div>
                      <span style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                        Attempt in Progress
                      </span>
                    </div>

                    {/* Question Rendering */}
                    {(() => {
                      const questions = quizQuestions;
                      if (!questions || questions.length === 0) return <p>Loading questions...</p>;
                      const q = questions[currentQuestionIndex];

                      return (
                        <div style={{ minHeight: '260px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.5, marginBottom: '20px' }}>
                            {q.questionText}
                          </h4>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {q.options.map((opt, oIdx) => {
                              const isSelected = userAnswers[currentQuestionIndex] === oIdx;
                              return (
                                <label
                                  key={oIdx}
                                  onClick={() => handleOptionSelect(currentQuestionIndex, oIdx)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '14px 18px',
                                    border: `1px solid ${isSelected ? '#0f172a' : '#e2e8f0'}`,
                                    background: isSelected ? '#f8fafc' : '#fff',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontWeight: isSelected ? 600 : 500,
                                    fontSize: '14px'
                                  }}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    checked={isSelected}
                                    onChange={() => {}}
                                    style={{ accentColor: '#0f172a', margin: 0 }}
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Navigation Buttons */}
                    <div className="dash-quiz-nav">
                      <button
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        style={{
                          padding: '10px 20px',
                          background: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                          opacity: currentQuestionIndex === 0 ? 0.5 : 1
                        }}
                      >
                        Previous Question
                      </button>

                      {currentQuestionIndex < 9 ? (
                        <button
                          onClick={() => {
                            if (userAnswers[currentQuestionIndex] === undefined) {
                              alert('Please select an option to continue.');
                              return;
                            }
                            setCurrentQuestionIndex(prev => prev + 1);
                          }}
                          style={{
                            padding: '10px 24px',
                            background: '#0f172a',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Next Question
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitQuiz}
                          disabled={isSubmittingQuiz}
                          style={{
                            padding: '10px 28px',
                            background: '#16a34a',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: isSubmittingQuiz ? 'not-allowed' : 'pointer',
                            opacity: isSubmittingQuiz ? 0.7 : 1,
                          }}
                        >
                          {isSubmittingQuiz ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Result Screen */}
                {quizStatus === 'result' && quizResult && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {quizResult.scholarshipEarned ? (
                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '8px', color: '#047857', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle size={18} />
                        Congratulations! You passed with {quizResult.scorePercent}% and earned your scholarship code.
                      </div>
                    ) : quizResult.canRetake ? (
                      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '16px', borderRadius: '8px', color: '#92400e', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={18} />
                        Score below {quizResult.passPercentRequired}%. Attempt {quizResult.attemptCount} of {quizResult.maxAttempts} — retake to earn your scholarship.
                      </div>
                    ) : (
                      <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', color: '#991b1b', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <AlertTriangle size={18} />
                        All {quizResult.maxAttempts} attempts used. No scholarship earned — you may proceed with the standard enrollment fee.
                      </div>
                    )}

                    <div className="dash-card">
                      <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>
                        Assessment Results
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>
                        Attempt {quizResult.attemptCount} of {quizResult.maxAttempts} · Scholarship requires {quizResult.passPercentRequired}% or higher.
                      </p>

                      <div className="dash-grid-4" style={{ marginBottom: '24px' }}>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Selected Program</span>
                          <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block', marginTop: '4px' }}>{selectedProgram}</strong>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Correct Answers</span>
                          <strong style={{ fontSize: '20px', color: '#16a34a', display: 'block', marginTop: '4px' }}>{quizResult.correct}/10</strong>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Wrong Answers</span>
                          <strong style={{ fontSize: '20px', color: '#ef4444', display: 'block', marginTop: '4px' }}>{quizResult.wrong}/10</strong>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <span style={{ display: 'block', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Final Score (%)</span>
                          <strong style={{ fontSize: '20px', color: quizResult.scorePercent >= quizResult.passPercentRequired ? '#16a34a' : '#ef4444', display: 'block', marginTop: '4px' }}>{quizResult.scorePercent}%</strong>
                        </div>
                      </div>

                      {quizResult.scholarshipEarned && quizResult.couponCode && (
                        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
                          <div style={{ color: '#047857', fontWeight: 800, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <Award />
                            Scholarship Code Generated!
                          </div>

                          <div style={{ display: 'inline-flex', background: '#10b981', color: '#fff', fontSize: '24px', fontWeight: 900, padding: '10px 28px', borderRadius: '8px', letterSpacing: '2px', margin: '8px 0 16px' }}>
                            {quizResult.couponCode}
                          </div>

                          <p style={{ color: '#065f46', fontSize: '13px', maxWidth: '580px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                            Your scholarship code is valid for 72 hours from the time of generation. Use it on the Payment tab before it expires.
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: '#065f46', background: '#d1fae5', padding: '8px 16px', borderRadius: '6px', width: 'fit-content', margin: '0 auto' }}>
                            <Clock size={16} style={{ color: '#ef4444' }} />
                            <span>Remaining Time: <strong style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '14px' }}>{countdown}</strong></span>
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => goToStudentTab('dashboard')}
                          className="btn btn-primary"
                          style={{ background: '#0f172a', borderColor: '#0f172a', color: '#fff' }}
                        >
                          Go to Dashboard Home
                        </button>
                        {quizResult.canRetake && (
                          <button
                            type="button"
                            onClick={handleRetakeQuiz}
                            className="btn btn-primary"
                            style={{ background: '#FFB800', borderColor: '#FFB800', color: '#0f172a' }}
                          >
                            Retake Assessment ({quizResult.maxAttempts - quizResult.attemptCount} left)
                          </button>
                        )}
                        {(quizResult.scholarshipEarned || !quizResult.canRetake) && (
                          <button
                            type="button"
                            onClick={() => goToStudentTab('payment')}
                            className="btn btn-primary"
                            style={{ background: quizResult.scholarshipEarned ? '#FFB800' : '#64748b', borderColor: quizResult.scholarshipEarned ? '#FFB800' : '#64748b', color: quizResult.scholarshipEarned ? '#0f172a' : '#fff' }}
                          >
                            Proceed to Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && learnerTabProps && (
              <StudentPaymentTab {...learnerTabProps} />
            )}

            {activeTab === 'schedule' && learnerTabProps && (
              <StudentScheduleTab
                progress={learnerTabProps.progress}
                scheduleEntries={scheduleEntries}
                scheduleLoading={scheduleLoading}
                onGoToQuiz={learnerTabProps.onGoToQuiz}
                onGoToPayment={learnerTabProps.onGoToPayment!}
              />
            )}

            {activeTab === 'certification' && learnerTabProps && (
              <StudentCertificationTab {...learnerTabProps} />
            )}

            {activeTab === 'support' && (
              <StudentSupportTab />
            )}

            {activeTab === 'quiz' && quizStatus === 'selection' && (
              <button
                type="button"
                className="dash-floating-start-btn"
                onClick={handleStartQuiz}
                disabled={!canStartQuiz}
                title={canStartQuiz ? `Start ${selectedProgram} assessment` : 'Select a program with 10 questions'}
              >
                Start Assessment
                <ChevronRight size={18} />
              </button>
            )}
          </>
        )}

        {/* ---------------- ADMIN MODE ---------------- */}
        {isAdmin && (
          <div>
            {/* SUBTAB 1: ATTEMPTS LIST */}
            {adminSubTab === 'attempts' && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>SIDEP Learner Quiz Attempts</h3>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Track student grades, scholarship codes generated, and scholarship duration status.</p>
                  </div>

                  <div className="dash-card-header-actions">
                    {/* Filter */}
                    <select
                      value={adminProgramFilter}
                      onChange={(e) => setAdminProgramFilter(e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600, outline: 'none' }}
                    >
                      <option value="All">All Programs</option>
                      {Object.keys(activeQuestions).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleExportAttemptsCSV}
                      className="dash-export-btn"
                    >
                      <Download size={14} />
                      Export Results (CSV)
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className={`dash-table-wrap admin-students-table-wrap ${isAttemptsLoading ? 'is-loading' : ''}`}>
                  <table className="admin-table admin-table--students">
                    <thead>
                      <tr>
                        <th className="admin-table-col-num">#</th>
                        <th>Candidate Name</th>
                        <th>Program</th>
                        <th>Score</th>
                        <th>Scholarship Code</th>
                        <th>Generated</th>
                        <th>Expiry Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isAttemptsLoading && attempts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="admin-table-empty">Loading attempts...</td>
                        </tr>
                      ) : attempts.map((att, index) => {
                        const expiry = getScholarshipStatus(att.generatedAt, !!att.couponCode);
                        const scorePercent = Math.round((att.score / att.totalQuestions) * 100);
                        return (
                          <tr key={att.id}>
                            <td className="admin-table-col-num">{attemptsShowingFrom + index}</td>
                            <td style={{ fontWeight: 600 }}>{att.candidateName}</td>
                            <td>{att.program}</td>
                            <td style={{ fontWeight: 600 }}>
                              {att.score}/{att.totalQuestions} ({scorePercent}%)
                            </td>
                            <td>
                              {att.couponCode ? (
                                <code className="admin-table-code">{att.couponCode}</code>
                              ) : (
                                <span style={{ color: '#94a3b8' }}>Not Earned</span>
                              )}
                            </td>
                            <td>{formatDateTime(att.generatedAt)}</td>
                            <td>
                              <span className={`status-badge ${expiry.expired ? 'expired' : 'active'}`}>
                                {expiry.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                      {!isAttemptsLoading && attempts.length === 0 && (
                        <tr>
                          <td colSpan={7} className="admin-table-empty">
                            No attempts match the filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalAttempts > 0 && (
                  <div className="pagination-container pagination-container--enhanced">
                    <div className="pagination-summary">
                      Showing <strong>{attemptsShowingFrom}</strong>–<strong>{attemptsShowingTo}</strong> of{' '}
                      <strong>{totalAttempts}</strong> attempts
                      <span className="pagination-page-label"> · Page {attemptsPage} of {totalAttemptsPages}</span>
                    </div>
                    <div className="pagination-buttons">
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setAttemptsPage(1)}
                        disabled={attemptsPage === 1 || isAttemptsLoading}
                        title="First page"
                      >
                        «
                      </button>
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setAttemptsPage((prev) => Math.max(1, prev - 1))}
                        disabled={attemptsPage === 1 || isAttemptsLoading}
                      >
                        Previous
                      </button>
                      {attemptPageNumbers.map((pNum, idx) =>
                        pNum === 'ellipsis' ? (
                          <span key={`att-ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                        ) : (
                          <button
                            key={pNum}
                            type="button"
                            className={`pagination-btn ${attemptsPage === pNum ? 'active' : ''}`}
                            onClick={() => setAttemptsPage(pNum)}
                            disabled={isAttemptsLoading}
                          >
                            {pNum}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setAttemptsPage((prev) => Math.min(totalAttemptsPages, prev + 1))}
                        disabled={attemptsPage === totalAttemptsPages || isAttemptsLoading}
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setAttemptsPage(totalAttemptsPages)}
                        disabled={attemptsPage === totalAttemptsPages || isAttemptsLoading}
                        title="Last page"
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* SUBTAB 2: REGISTERED STUDENTS LIST */}
            {adminSubTab === 'students' && (
              <div className="dash-card">
                <div className="dash-card-header">
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Registered Students Profile List</h3>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Review registrations and applications completed on the portal.</p>
                  </div>

                  <div className="dash-card-header-actions dash-card-header-actions--search">
                    {/* Search Input */}
                    <div className="dash-search-wrap">
                      <input
                        type="text"
                        placeholder="Search student or college..."
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        className="dash-search-input"
                      />
                      <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>

                    <button
                      type="button"
                      onClick={handleExportStudentsCSV}
                      className="dash-export-btn"
                    >
                      <Download size={14} />
                      Export Students (CSV)
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className={`dash-table-wrap admin-students-table-wrap ${isStudentsLoading ? 'is-loading' : ''}`}>
                  <table className="admin-table admin-table--students">
                    <thead>
                      <tr>
                        <th className="admin-table-col-num">#</th>
                        <th>Full Name</th>
                        <th>Email &amp; Mobile</th>
                        <th>DOB &amp; Gender</th>
                        <th>Aadhaar</th>
                        <th>College</th>
                        <th>Status</th>
                        <th>Paid</th>
                        <th>Quiz</th>
                        <th>Registered</th>
                        <th className="admin-table-col-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isStudentsLoading && registeredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={11} className="admin-table-empty">
                            Loading students...
                          </td>
                        </tr>
                      ) : registeredStudents.map((std, index) => (
                        <tr key={std.id}>
                          <td className="admin-table-col-num">{studentsShowingFrom + index}</td>
                          <td style={{ fontWeight: 600 }}>{std.fullName}</td>
                          <td>
                            <div className="admin-table-primary">{std.email}</div>
                            <div className="admin-table-secondary">{std.mobile}</div>
                          </td>
                          <td>
                            <div>{formatDob(std.dob)}</div>
                            <div className="admin-table-secondary">{std.gender}</div>
                          </td>
                          <td>
                            <code className="admin-table-code">{std.aadhaar}</code>
                          </td>
                          <td>{std.college}</td>
                          <td>
                            <div className="admin-table-primary admin-table-primary--accent">{std.studentStatus}</div>
                            <div className="admin-table-secondary">{std.workStatus}</div>
                          </td>
                          <td>
                            {std.paymentStatus === 'paid' ? (
                              <span className="status-badge active">Yes</span>
                            ) : std.paymentStatus === 'pending' ? (
                              <span className="status-badge pending">Pending</span>
                            ) : (
                              <span className="status-badge expired">No</span>
                            )}
                          </td>
                          <td>
                            {std.quizAttended ? (
                              <div>
                                <span className="status-badge active">Attended</span>
                                <div className="admin-table-secondary" style={{ marginTop: '6px' }}>
                                  <strong>{std.quizProgram}</strong>
                                </div>
                                {std.quizScore != null && std.quizTotalQuestions != null && (
                                  <div className="admin-table-secondary">
                                    Score: {std.quizScore}/{std.quizTotalQuestions}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="status-badge expired">Not Attempted</span>
                            )}
                          </td>
                          <td>
                            <div>{formatDateTime(std.registeredAt)}</div>
                            {std.quizAttemptedAt && (
                              <div className="admin-table-secondary">Quiz: {formatDateTime(std.quizAttemptedAt)}</div>
                            )}
                          </td>
                          <td className="admin-table-col-actions">
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(std.id)}
                              disabled={deletingStudentId === std.id}
                              className="admin-table-delete-btn"
                              title="Delete student record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!isStudentsLoading && registeredStudents.length === 0 && (
                        <tr>
                          <td colSpan={11} className="admin-table-empty">
                            No registered students match the search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalStudents > 0 && (
                  <div className="pagination-container pagination-container--enhanced">
                    <div className="pagination-summary">
                      Showing <strong>{studentsShowingFrom}</strong>–<strong>{studentsShowingTo}</strong> of{' '}
                      <strong>{totalStudents}</strong> students
                      <span className="pagination-page-label"> · Page {studentsPage} of {totalStudentsPages}</span>
                    </div>
                    <div className="pagination-buttons">
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setStudentsPage(1)}
                        disabled={studentsPage === 1 || isStudentsLoading}
                        title="First page"
                      >
                        «
                      </button>
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setStudentsPage((prev) => Math.max(1, prev - 1))}
                        disabled={studentsPage === 1 || isStudentsLoading}
                      >
                        Previous
                      </button>
                      {studentPageNumbers.map((pNum, idx) =>
                        pNum === 'ellipsis' ? (
                          <span key={`ellipsis-${idx}`} className="pagination-ellipsis">…</span>
                        ) : (
                          <button
                            key={pNum}
                            type="button"
                            className={`pagination-btn ${studentsPage === pNum ? 'active' : ''}`}
                            onClick={() => setStudentsPage(pNum)}
                            disabled={isStudentsLoading}
                          >
                            {pNum}
                          </button>
                        )
                      )}
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setStudentsPage((prev) => Math.min(totalStudentsPages, prev + 1))}
                        disabled={studentsPage === totalStudentsPages || isStudentsLoading}
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        className="pagination-btn"
                        onClick={() => setStudentsPage(totalStudentsPages)}
                        disabled={studentsPage === totalStudentsPages || isStudentsLoading}
                        title="Last page"
                      >
                        »
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* SUBTAB 3: MANAGE TRAINING PROGRAMS */}
            {adminSubTab === 'programs' && (
              <div className="dash-grid-2 dash-grid-2--wide">
                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FilePlus style={{ color: '#FFB800' }} size={20} />
                    Add Training Program
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>
                    First, initialize a new digital training program. Once added, go to the "Manage Quizzes" tab to configure the quiz questions.
                  </p>

                  <form onSubmit={handleAddProgram} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="register-form-group">
                      <label htmlFor="adminNewProgramName">Program Name *</label>
                      <input
                        type="text"
                        id="adminNewProgramName"
                        placeholder="e.g. Cybersecurity Fundamentals"
                        value={newProgramName}
                        onChange={(e) => setNewProgramName(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ background: '#0f172a', borderColor: '#0f172a', color: '#fff', width: 'fit-content' }}>
                      Add Program
                    </button>
                  </form>
                </div>

                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0' }}>Active Training Programs</h3>
                  
                  <div style={{ overflowY: 'auto', maxHeight: '420px' }}>
                    {Object.keys(activeQuestions).map(pName => {
                      const count = activeQuestions[pName]?.length || 0;
                      return (
                        <div key={pName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
                          <div>
                            <strong style={{ fontSize: '14px', display: 'block' }}>{pName}</strong>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{count} questions configured</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 700, background: count === 10 ? '#dcfce7' : '#fffbeb', color: count === 10 ? '#16a34a' : '#d97706' }}>
                              {count === 10 ? 'Quiz Ready' : 'Needs Questions'}
                            </span>
                            <button
                              onClick={() => handleDeleteProgram(pName)}
                              style={{ display: 'flex', alignItems: 'center', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete training program"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 4: MANAGE QUIZZES (ADD QUESTIONS) */}
            {adminSubTab === 'quizzes' && (
              <div className="dash-grid-2">
                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle style={{ color: '#16a34a' }} size={20} />
                    {editingQuestionIndex !== null ? 'Edit Quiz Question' : 'Add Quiz Question'}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>
                    {editingQuestionIndex !== null
                      ? `Editing question ${editingQuestionIndex + 1}. Update the fields below and save.`
                      : 'Configure specific multiple-choice assessment questions for an existing training program.'}
                  </p>

                  <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div className="register-form-group">
                      <label htmlFor="adminSelectProg">Select Training Program *</label>
                      <select
                        id="adminSelectProg"
                        value={targetProgramForQuestion}
                        onChange={(e) => {
                          setTargetProgramForQuestion(e.target.value);
                          resetQuestionForm();
                        }}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      >
                        <option value="">-- Choose Program --</option>
                        {Object.keys(activeQuestions).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="register-form-group">
                      <label htmlFor="adminQuestionText">Question Text *</label>
                      <textarea
                        id="adminQuestionText"
                        rows={2}
                        placeholder="Enter the MCQ question text"
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                      />
                    </div>

                    <div className="dash-options-grid">
                      <div className="register-form-group">
                        <label>Option 1 *</label>
                        <input
                          type="text"
                          placeholder="Option 1"
                          value={newOptions[0]}
                          onChange={(e) => setNewOptions([e.target.value, newOptions[1], newOptions[2], newOptions[3]])}
                        />
                      </div>
                      <div className="register-form-group">
                        <label>Option 2 *</label>
                        <input
                          type="text"
                          placeholder="Option 2"
                          value={newOptions[1]}
                          onChange={(e) => setNewOptions([newOptions[0], e.target.value, newOptions[2], newOptions[3]])}
                        />
                      </div>
                      <div className="register-form-group">
                        <label>Option 3 *</label>
                        <input
                          type="text"
                          placeholder="Option 3"
                          value={newOptions[2]}
                          onChange={(e) => setNewOptions([newOptions[0], newOptions[1], e.target.value, newOptions[3]])}
                        />
                      </div>
                      <div className="register-form-group">
                        <label>Option 4 *</label>
                        <input
                          type="text"
                          placeholder="Option 4"
                          value={newOptions[3]}
                          onChange={(e) => setNewOptions([newOptions[0], newOptions[1], newOptions[2], e.target.value])}
                        />
                      </div>
                    </div>

                    <div className="register-form-group">
                      <label htmlFor="adminCorrectOption">Correct Option *</label>
                      <select
                        id="adminCorrectOption"
                        value={correctOptionIdx}
                        onChange={(e) => setCorrectOptionIdx(parseInt(e.target.value))}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
                      >
                        <option value={0}>Option 1</option>
                        <option value={1}>Option 2</option>
                        <option value={2}>Option 3</option>
                        <option value={3}>Option 4</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button type="submit" className="btn btn-primary" style={{ background: '#16a34a', borderColor: '#16a34a', color: '#fff', width: 'fit-content' }}>
                        {editingQuestionIndex !== null ? 'Update Question' : 'Add Question to Quiz'}
                      </button>
                      {editingQuestionIndex !== null && (
                        <button
                          type="button"
                          onClick={resetQuestionForm}
                          style={{ padding: '10px 18px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0' }}>Quiz Status & Quick Tools</h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>
                    Questions for the program selected on the left. Review, auto-fill, or clear entries.
                  </p>

                  {!targetProgramForQuestion ? (
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      Select a training program from the left to view its questions.
                    </div>
                  ) : (() => {
                    const pName = targetProgramForQuestion;
                    const questions = activeQuestions[pName] || [];
                    const count = questions.length;
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                            <div>
                              <strong style={{ fontSize: '15px', color: '#0f172a' }}>{pName}</strong>
                              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                Questions configured: <strong>{count} of 10</strong>
                              </span>
                              <span style={{ display: 'inline-block', marginTop: '8px', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 700, background: count === 10 ? '#dcfce7' : '#fffbeb', color: count === 10 ? '#16a34a' : '#d97706' }}>
                                {count === 10 ? 'Quiz Ready' : 'Needs Questions'}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {count < 10 && (
                                <button
                                  onClick={() => handleQuickGenerateMock(pName)}
                                  className="btn btn-secondary"
                                  style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  title="Autofill remaining questions with mock data"
                                >
                                  <RefreshCw size={12} /> Auto-populate
                                </button>
                              )}
                              {count > 0 && (
                                <button
                                  onClick={() => handleClearProgramQuestions(pName)}
                                  style={{ padding: '8px 12px', background: '#fee2e2', border: '1px solid #fecaca', color: '#ef4444', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                  Clear All
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {count === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '14px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                            No questions added yet. Use the form on the left to add questions.
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
                            {questions.map((q, idx) => (
                              <div
                                key={`${pName}-${idx}`}
                                style={{
                                  background: editingQuestionIndex === idx && targetProgramForQuestion === pName ? '#fffbeb' : '#fff',
                                  padding: '16px',
                                  borderRadius: '8px',
                                  border: `1px solid ${editingQuestionIndex === idx && targetProgramForQuestion === pName ? '#fde68a' : '#e2e8f0'}`,
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0f172a', lineHeight: 1.5 }}>
                                    <span style={{ color: '#FFB800', marginRight: '6px' }}>Q{idx + 1}.</span>
                                    {q.questionText}
                                  </p>
                                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                    <button
                                      onClick={() => handleStartEditQuestion(pName, idx)}
                                      style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '2px' }}
                                      title="Edit this question"
                                    >
                                      <Pencil size={15} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteQuestion(pName, idx)}
                                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '2px' }}
                                      title="Delete this question"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {q.options.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      style={{
                                        fontSize: '13px',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background: oIdx === q.correctIndex ? '#ecfdf5' : '#f8fafc',
                                        border: `1px solid ${oIdx === q.correctIndex ? '#a7f3d0' : '#e2e8f0'}`,
                                        color: oIdx === q.correctIndex ? '#047857' : '#475569',
                                        fontWeight: oIdx === q.correctIndex ? 600 : 400,
                                      }}
                                    >
                                      {String.fromCharCode(65 + oIdx)}. {opt}
                                      {oIdx === q.correctIndex && (
                                        <span style={{ marginLeft: '8px', fontSize: '11px', fontWeight: 700 }}>(Correct)</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* SUBTAB: PAYMENT REVIEWS */}
            {adminSubTab === 'payments' && (
              <AdminPaymentsPanel
                payments={paymentSubmissions}
                totalPayments={totalPayments}
                paymentsPage={paymentsPage}
                paymentStatusFilter={paymentStatusFilter}
                isLoading={isPaymentsLoading}
                reviewingId={reviewingPaymentId}
                onFilterChange={setPaymentStatusFilter}
                onPageChange={setPaymentsPage}
                onApprove={handleApprovePayment}
                onReject={handleRejectPayment}
              />
            )}

            {/* SUBTAB 5: MANAGE SCHEDULE */}
            {adminSubTab === 'schedule' && (
              <div className="dash-grid-2 dash-grid-2--wide">
                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarDays style={{ color: '#0284c7' }} size={20} />
                    Upload Training Schedule
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px' }}>
                    Publish class dates and sessions to the student schedule calendar. Attach a PDF or image if needed.
                  </p>

                  <form onSubmit={handleUploadSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="register-form-group">
                      <label htmlFor="schedTitle">Session Title *</label>
                      <input
                        id="schedTitle"
                        type="text"
                        placeholder="e.g. Week 1 — Introduction to SAP"
                        value={scheduleTitle}
                        onChange={(e) => setScheduleTitle(e.target.value)}
                      />
                    </div>

                    <div className="register-form-group">
                      <label htmlFor="schedProgram">Training Program</label>
                      <select
                        id="schedProgram"
                        value={scheduleProgram}
                        onChange={(e) => setScheduleProgram(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="">All Programs</option>
                        {Object.keys(activeQuestions).map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    <div className="dash-options-grid">
                      <div className="register-form-group">
                        <label htmlFor="schedStart">Start Date *</label>
                        <input
                          id="schedStart"
                          type="date"
                          value={scheduleStartDate}
                          onChange={(e) => setScheduleStartDate(e.target.value)}
                        />
                      </div>
                      <div className="register-form-group">
                        <label htmlFor="schedEnd">End Date</label>
                        <input
                          id="schedEnd"
                          type="date"
                          value={scheduleEndDate}
                          onChange={(e) => setScheduleEndDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="register-form-group">
                      <label htmlFor="schedDesc">Description</label>
                      <textarea
                        id="schedDesc"
                        rows={2}
                        placeholder="Session details, venue, timings..."
                        value={scheduleDescription}
                        onChange={(e) => setScheduleDescription(e.target.value)}
                      />
                    </div>

                    <div className="register-form-group">
                      <label htmlFor="schedFile">Schedule File (PDF / Image)</label>
                      <input
                        id="schedFile"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => setScheduleFile(e.target.files?.[0] ?? null)}
                      />
                      {scheduleFile && (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{scheduleFile.name}</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isUploadingSchedule}
                      className="btn btn-primary"
                      style={{ background: '#0284c7', borderColor: '#0284c7', color: '#fff', width: 'fit-content' }}
                    >
                      {isUploadingSchedule ? 'Uploading...' : 'Publish Schedule'}
                    </button>
                  </form>
                </div>

                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px' }}>Published Schedules</h3>
                  {adminScheduleEntries.length === 0 ? (
                    <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      No schedule entries yet. Upload your first training session above.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '520px', overflowY: 'auto' }}>
                      {adminScheduleEntries.map((entry) => (
                        <div key={entry.id} style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div>
                              <strong style={{ fontSize: '14px', display: 'block' }}>{entry.title}</strong>
                              <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                                {new Date(entry.startDate).toLocaleDateString('en-IN')}
                                {entry.endDate && entry.endDate !== entry.startDate && ` — ${new Date(entry.endDate).toLocaleDateString('en-IN')}`}
                              </span>
                              {entry.program && (
                                <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600, display: 'inline-block', marginTop: '6px' }}>{entry.program}</span>
                              )}
                              {entry.description && (
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '8px 0 0' }}>{entry.description}</p>
                              )}
                              {entry.fileUrl && (
                                <a href={getUploadUrl(entry.fileUrl)} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#16a34a', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                                  <FilePlus size={12} /> {entry.fileName || 'View file'}
                                </a>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteSchedule(entry.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                              title="Delete schedule entry"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {adminSubTab === 'support' && (
              <AdminSupportPanel />
            )}
          </div>
        )}

      </main>
    </div>
  );
}
