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
} from 'lucide-react';
import type { Question } from '../data/questions';
import {
  authApi,
  adminApi,
  quizApi,
  getAuthUser,
  getToken,
  setAuth,
  clearAuth,
  type AuthUser,
} from '../api/client';

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
  quizAttended: boolean;
  quizProgram: string | null;
  quizScore: number | null;
  quizTotalQuestions: number | null;
  quizCouponCode: string | null;
  quizAttemptedAt: string | null;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const isAdmin = authUser?.role === 'admin';
  // 'dashboard' or 'quiz'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz'>('dashboard');

  // --- Admin Navigation Sub-Tabs ---
  // 'attempts' or 'students' or 'programs' or 'quizzes'
  const [adminSubTab, setAdminSubTab] = useState<'attempts' | 'students' | 'programs' | 'quizzes'>('attempts');

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
  const [studentsPage, setStudentsPage] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mapAttempt = (a: Record<string, unknown>): QuizAttempt => ({
    id: String(a.id),
    candidateName: String(a.candidateName),
    program: String(a.program),
    score: Number(a.score),
    totalQuestions: Number(a.totalQuestions),
    couponCode: String(a.couponCode),
    generatedAt: new Date(String(a.generatedAt)).toISOString(),
    status: String(a.status || 'completed'),
  });

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
    quizAttended: Boolean(s.quizAttended),
    quizProgram: s.quizProgram ? String(s.quizProgram) : null,
    quizScore: s.quizScore != null ? Number(s.quizScore) : null,
    quizTotalQuestions: s.quizTotalQuestions != null ? Number(s.quizTotalQuestions) : null,
    quizCouponCode: s.quizCouponCode ? String(s.quizCouponCode) : null,
    quizAttemptedAt: s.quizAttemptedAt ? new Date(String(s.quizAttemptedAt)).toISOString() : null,
  });

  const reloadAdminData = useCallback(async () => {
    const [studentsRes, attemptsRes, questionsRes] = await Promise.all([
      adminApi.getStudents(studentSearchQuery),
      quizApi.getAttempts(adminProgramFilter),
      quizApi.getAdminQuestions(),
    ]);
    setRegisteredStudents(studentsRes.data.map(mapStudent));
    setAttempts(attemptsRes.data.map(mapAttempt));
    setActiveQuestions(questionsRes.data as Record<string, Question[]>);
  }, [adminProgramFilter, studentSearchQuery]);

  const reloadStudentData = useCallback(async () => {
    const [programsRes, latestRes] = await Promise.all([
      quizApi.getPrograms(),
      quizApi.getLatestAttempt(),
    ]);
    setProgramList(programsRes.data);

    if (latestRes.attempt) {
      const att = latestRes.attempt;
      const score = Number(att.score);
      const total = Number(att.totalQuestions);
      const generatedTime = new Date(String(att.generatedAt)).toISOString();
      setQuizResult({
        correct: score,
        wrong: total - score,
        scorePercent: Math.round((score / total) * 100),
        couponCode: String(att.couponCode),
        generatedTime,
      });
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
          const message = err instanceof Error ? err.message : 'Failed to load dashboard';
          if (message.toLowerCase().includes('token') || message.toLowerCase().includes('unauthorized')) {
            clearAuth();
            navigate('/login');
          } else {
            setLoadError(message);
          }
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
  }, [authUser, isAdmin, adminProgramFilter, studentSearchQuery, reloadAdminData]);

  // Reset pagination pages when filters change
  useEffect(() => {
    setAttemptsPage(1);
  }, [adminProgramFilter]);

  useEffect(() => {
    setStudentsPage(1);
  }, [studentSearchQuery]);

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

  // Update Countdown Live Timer
  useEffect(() => {
    if (!quizResult) return;
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
        couponCode: res.result.couponCode,
        generatedTime: new Date(String(res.result.generatedTime)).toISOString(),
      };

      setQuizResult(result);
      setQuizStatus('result');

      if (authUser?.role === 'admin') {
        await reloadAdminData();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  // Format Helper
  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Expiry Checker
  const getScholarshipStatus = (isoString: string) => {
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
  const handleExportAttemptsCSV = () => {
    const csvHeaders = ['Candidate Name', 'Selected Program', 'Score', 'Scholarship Code', 'Generated At', 'Expiry Status'];
    const csvRows = attempts.map(att => {
      const { text } = getScholarshipStatus(att.generatedAt);
      return [
        `"${att.candidateName}"`,
        `"${att.program}"`,
        `"${att.score}/${att.totalQuestions}"`,
        `"${att.couponCode}"`,
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
  };

  // CSV Export for Registered Students
  const handleExportStudentsCSV = () => {
    const csvHeaders = ['Full Name', 'Email ID', 'Mobile Number', 'Date of Birth', 'Gender', 'Aadhaar Number', 'College Name', 'Student Status', 'Working Status', 'Quiz Attended', 'Quiz Program', 'Quiz Score', 'Registered At'];
    const csvRows = registeredStudents.map(std => {
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
    try {
      await adminApi.deleteStudent(studentId);
      await reloadAdminData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete student');
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

  // --- Pagination & Filtering Variables ---
  const attemptsPageSize = 3;
  const filteredAttempts = attempts.filter(att => adminProgramFilter === 'All' || att.program === adminProgramFilter);
  const totalAttemptsPages = Math.ceil(filteredAttempts.length / attemptsPageSize);
  const paginatedAttempts = filteredAttempts.slice((attemptsPage - 1) * attemptsPageSize, attemptsPage * attemptsPageSize);

  const studentsPageSize = 3;
  const filteredStudents = registeredStudents.filter(std => {
    const query = studentSearchQuery.toLowerCase();
    return std.fullName.toLowerCase().includes(query) || std.college.toLowerCase().includes(query);
  });
  const totalStudentsPages = Math.ceil(filteredStudents.length / studentsPageSize);
  const paginatedStudents = filteredStudents.slice((studentsPage - 1) * studentsPageSize, studentsPage * studentsPageSize);

  const userInitials = authUser?.fullName
    ? authUser.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';
  const firstName = authUser?.fullName?.split(' ')[0] || 'Learner';
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
            {isAdmin ? 'Admin Dashboard' : activeTab === 'dashboard' ? `Hi, ${firstName}` : 'SIDEP Assessment'}
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
            </>
          ) : (
            <>
              <button
                className={`dash-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); closeSidebar(); }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => { setActiveTab('quiz'); closeSidebar(); }}
              >
                <BookOpen size={18} />
                Quiz
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
              {isAdmin ? 'Admin Dashboard' : activeTab === 'dashboard' ? `Welcome back, ${firstName}!` : 'SIDEP Assessment'}
            </h1>
            <p className="dash-page-subtitle">
              {isAdmin
                ? 'Monitor quiz attempts, track registered students, configure training programs, and authorize evaluation quizzes.'
                : 'Digital Empowerment & Skill Validation Hub.'}
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
                        {quizResult ? 'Assessment Completed' : 'Enrolled'}
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
                        {quizResult ? getScholarshipStatus(quizResult.generatedTime).text : 'No Scholarship Generated'}
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

                  {quizResult && (
                    <div style={{ marginTop: '32px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
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
                  )}

                  {!quizResult && (
                    <div className="dash-alert-banner">
                      <div className="dash-alert-banner-content">
                        <AlertTriangle style={{ color: '#d97706' }} size={24} />
                        <div>
                          <strong style={{ color: '#92400e', fontSize: '14px' }}>Skills Assessment Pending</strong>
                          <span style={{ display: 'block', fontSize: '13px', color: '#b45309' }}>Please take your assessment to unlock your program scholarship code.</span>
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
                </div>
              </div>
            )}

            {/* TABS: QUIZ CONTENT */}
            {activeTab === 'quiz' && (
              <div>
                {/* Step 1: Program Selection */}
                {quizStatus === 'selection' && (
                  <div className="dash-card">
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Select Your Training Program</h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                      Choose the training program you want to validate. You can attempt the quiz only <strong>once</strong>. Once started, you cannot change your program.
                    </p>

                    <div className="quiz-program-grid" style={{ marginBottom: '32px' }}>
                      {programList.map(({ name: programName, questionCount: qCount }) => {
                        const isSelected = selectedProgram === programName;
                        return (
                          <div
                            key={programName}
                            className={`program-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              if (!startedQuiz) {
                                setSelectedProgram(programName);
                              }
                            }}
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                      <button
                        onClick={handleStartQuiz}
                        disabled={!selectedProgram || (programList.find((p) => p.name === selectedProgram)?.questionCount ?? 0) !== 10}
                        className="btn btn-primary"
                        style={{
                          background: '#0f172a',
                          borderColor: '#0f172a',
                          color: '#fff',
                          padding: '12px 28px',
                          fontSize: '14px',
                          fontWeight: 700,
                          opacity: (selectedProgram && (programList.find((p) => p.name === selectedProgram)?.questionCount ?? 0) === 10) ? 1 : 0.5,
                          cursor: (selectedProgram && (programList.find((p) => p.name === selectedProgram)?.questionCount ?? 0) === 10) ? 'pointer' : 'not-allowed'
                        }}
                      >
                        Start Assessment
                      </button>
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
                    <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '16px', borderRadius: '8px', color: '#991b1b', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertTriangle size={18} />
                      Quiz Already Completed. You are not allowed to retake this assessment.
                    </div>

                    <div className="dash-card">
                      <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 8px 0', color: '#1e293b' }}>
                        Assessment Results
                      </h3>
                      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0' }}>
                        Skill validation details for your program evaluation.
                      </p>

                      <div className="dash-grid-4">
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
                          <strong style={{ fontSize: '20px', color: '#0284c7', display: 'block', marginTop: '4px' }}>{quizResult.scorePercent}%</strong>
                        </div>
                      </div>

                      {/* Scholarship Box */}
                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ color: '#047857', fontWeight: 800, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Award />
                          Assessment Completed Successfully!
                        </div>
                        
                        <div style={{ display: 'inline-flex', background: '#10b981', color: '#fff', fontSize: '24px', fontWeight: 900, padding: '10px 28px', borderRadius: '8px', letterSpacing: '2px', margin: '8px 0 16px' }}>
                          {quizResult.couponCode}
                        </div>

                        <p style={{ color: '#065f46', fontSize: '13px', maxWidth: '580px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                          "Congratulations! You have successfully completed the assessment. Your scholarship code is valid for 72 hours from the time of generation. Please use it before it expires. Our team will contact you shortly."
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', color: '#065f46', background: '#d1fae5', padding: '8px 16px', borderRadius: '6px', width: 'fit-content', margin: '0 auto' }}>
                          <Clock size={16} style={{ color: '#ef4444' }} />
                          <span>Remaining Time: <strong style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: '14px' }}>{countdown}</strong></span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '16px' }}>
                        <button
                          onClick={() => setActiveTab('dashboard')}
                          className="btn btn-primary"
                          style={{ background: '#0f172a', borderColor: '#0f172a', color: '#fff' }}
                        >
                          Go to Dashboard Home
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
                <div className="dash-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Candidate Name</th>
                        <th>Selected Program</th>
                        <th>Score</th>
                        <th>Scholarship Code</th>
                        <th>Generated Date &amp; Time</th>
                        <th>Scholarship Expiry Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAttempts.map(att => {
                        const expiry = getScholarshipStatus(att.generatedAt);
                        return (
                          <tr key={att.id}>
                            <td style={{ fontWeight: 600 }}>{att.candidateName}</td>
                            <td>{att.program}</td>
                            <td style={{ fontWeight: 600 }}>
                              {att.score}/{att.totalQuestions} ({ (att.score / att.totalQuestions) * 100 }%)
                            </td>
                            <td>
                              <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                {att.couponCode}
                              </code>
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
                      {filteredAttempts.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                            No attempts match the filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredAttempts.length > 0 && (
                  <div className="pagination-container">
                    <div>
                      Showing <strong>{Math.min(filteredAttempts.length, (attemptsPage - 1) * attemptsPageSize + 1)}</strong> to{' '}
                      <strong>{Math.min(filteredAttempts.length, attemptsPage * attemptsPageSize)}</strong> of{' '}
                      <strong>{filteredAttempts.length}</strong> entries
                    </div>
                    <div className="pagination-buttons">
                      <button
                        className="pagination-btn"
                        onClick={() => setAttemptsPage(prev => Math.max(1, prev - 1))}
                        disabled={attemptsPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalAttemptsPages }, (_, i) => i + 1).map(pNum => (
                        <button
                          key={pNum}
                          className={`pagination-btn ${attemptsPage === pNum ? 'active' : ''}`}
                          onClick={() => setAttemptsPage(pNum)}
                        >
                          {pNum}
                        </button>
                      ))}
                      <button
                        className="pagination-btn"
                        onClick={() => setAttemptsPage(prev => Math.min(totalAttemptsPages, prev + 1))}
                        disabled={attemptsPage === totalAttemptsPages}
                      >
                        Next
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
                <div className="dash-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email &amp; Mobile</th>
                        <th>DOB &amp; Gender</th>
                        <th>Aadhaar Number</th>
                        <th>College / Institution</th>
                        <th>Status (Edu / Job)</th>
                        <th>Quiz Status</th>
                        <th>Registration Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedStudents.map(std => (
                        <tr key={std.id}>
                          <td style={{ fontWeight: 600 }}>{std.fullName}</td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{std.email}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{std.mobile}</div>
                          </td>
                          <td>
                            <div>{formatDob(std.dob)}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{std.gender}</div>
                          </td>
                          <td>
                            <code style={{ background: '#f1f5f9', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>
                              {std.aadhaar}
                            </code>
                          </td>
                          <td>{std.college}</td>
                          <td>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#0369a1' }}>{std.studentStatus}</div>
                            <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{std.workStatus}</div>
                          </td>
                          <td>
                            {std.quizAttended ? (
                              <div>
                                <span className="status-badge active" style={{ marginBottom: '6px', display: 'inline-block' }}>
                                  Attended
                                </span>
                                <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
                                  <strong>{std.quizProgram}</strong>
                                </div>
                                {std.quizScore != null && std.quizTotalQuestions != null && (
                                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                                    Score: {std.quizScore}/{std.quizTotalQuestions}
                                  </div>
                                )}
                                {std.quizAttemptedAt && (
                                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                    {formatDateTime(std.quizAttemptedAt)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="status-badge expired">Not Attempted</span>
                            )}
                          </td>
                          <td>{formatDateTime(std.registeredAt)}</td>
                          <td>
                            <button
                              onClick={() => handleDeleteStudent(std.id)}
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Delete student record"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredStudents.length === 0 && (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                            No registered students match the search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredStudents.length > 0 && (
                  <div className="pagination-container">
                    <div>
                      Showing <strong>{Math.min(filteredStudents.length, (studentsPage - 1) * studentsPageSize + 1)}</strong> to{' '}
                      <strong>{Math.min(filteredStudents.length, studentsPage * studentsPageSize)}</strong> of{' '}
                      <strong>{filteredStudents.length}</strong> entries
                    </div>
                    <div className="pagination-buttons">
                      <button
                        className="pagination-btn"
                        onClick={() => setStudentsPage(prev => Math.max(1, prev - 1))}
                        disabled={studentsPage === 1}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalStudentsPages }, (_, i) => i + 1).map(pNum => (
                        <button
                          key={pNum}
                          className={`pagination-btn ${studentsPage === pNum ? 'active' : ''}`}
                          onClick={() => setStudentsPage(pNum)}
                        >
                          {pNum}
                        </button>
                      ))}
                      <button
                        className="pagination-btn"
                        onClick={() => setStudentsPage(prev => Math.min(totalStudentsPages, prev + 1))}
                        disabled={studentsPage === totalStudentsPages}
                      >
                        Next
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
          </div>
        )}

      </main>
    </div>
  );
}
