import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle,
  LogOut,
  Sliders,
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
  Search
} from 'lucide-react';
import { questionBank as defaultQuestionBank } from '../data/questions';
import type { Question } from '../data/questions';

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
  registeredAt: string; // ISO string
}

export default function Dashboard() {
  const navigate = useNavigate();

  // --- Theme/Role Mode ---
  const [isAdminMode, setIsAdminMode] = useState(false);

  // --- Student Navigation Menu Tab ---
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

  // --- Stateful Questions database ---
  const [activeQuestions, setActiveQuestions] = useState<Record<string, Question[]>>({});

  // --- Manage Programs & Quizzes Admin Forms ---
  const [newProgramName, setNewProgramName] = useState<string>('');
  const [targetProgramForQuestion, setTargetProgramForQuestion] = useState<string>('');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState<number>(0);

  // --- Attempts List State (for Admin) ---
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [adminProgramFilter, setAdminProgramFilter] = useState<string>('All');
  const [attemptsPage, setAttemptsPage] = useState<number>(1);

  // --- Registered Students State (for Admin) ---
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState<string>('');
  const [studentsPage, setStudentsPage] = useState<number>(1);

  // Load / Seed Data
  useEffect(() => {
    // 1. Load active questions (default or custom)
    const storedQuestions = localStorage.getItem('custom_questions');
    if (storedQuestions) {
      setActiveQuestions(JSON.parse(storedQuestions));
    } else {
      localStorage.setItem('custom_questions', JSON.stringify(defaultQuestionBank));
      setActiveQuestions(defaultQuestionBank);
    }

    // 2. Seed attempts
    const storedAttempts = localStorage.getItem('quiz_attempts');
    if (storedAttempts) {
      setAttempts(JSON.parse(storedAttempts));
    } else {
      const mockAttempts: QuizAttempt[] = [
        {
          id: 'att-1',
          candidateName: 'Rahul Kumar',
          program: 'SAP Training',
          score: 9,
          totalQuestions: 10,
          couponCode: 'SAP2026R9T1',
          generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 'att-2',
          candidateName: 'Priya Sharma',
          program: 'Artificial Intelligence',
          score: 8,
          totalQuestions: 10,
          couponCode: 'AI2026P8X2',
          generatedAt: new Date(Date.now() - 75 * 60 * 60 * 1000).toISOString(), // Expired
          status: 'completed'
        },
        {
          id: 'att-3',
          candidateName: 'Amit Patel',
          program: 'Cloud Computing',
          score: 10,
          totalQuestions: 10,
          couponCode: 'CC2026A10Y3',
          generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        },
        {
          id: 'att-4',
          candidateName: 'Sanjana Roy',
          program: 'Python Programming',
          score: 7,
          totalQuestions: 10,
          couponCode: 'PY2026S7Z4',
          generatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: 'completed'
        }
      ];
      localStorage.setItem('quiz_attempts', JSON.stringify(mockAttempts));
      setAttempts(mockAttempts);
    }

    // 3. Seed and load registered students
    const storedStudents = localStorage.getItem('registered_students');
    if (storedStudents) {
      setRegisteredStudents(JSON.parse(storedStudents));
    } else {
      const mockStudents: RegisteredStudent[] = [
        {
          id: 'std-1',
          fullName: 'Rahul Kumar',
          email: 'rahul@example.com',
          mobile: '9876543211',
          dob: '2001-05-15',
          gender: 'Male',
          aadhaar: '111122223333',
          address: 'Mumbai, Maharashtra',
          college: 'IIT Bombay',
          studentStatus: 'Passed Out',
          workStatus: 'Working',
          reason: 'To upskill in enterprise ERP platforms',
          registeredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'std-2',
          fullName: 'Priya Sharma',
          email: 'priya@example.com',
          mobile: '9876543212',
          dob: '2002-08-20',
          gender: 'Female',
          aadhaar: '222233334444',
          address: 'Delhi, India',
          college: 'Delhi University',
          studentStatus: 'Current Student',
          workStatus: 'Not Working',
          reason: 'Interested in core machine learning modules',
          registeredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'std-3',
          fullName: 'Amit Patel',
          email: 'amit@example.com',
          mobile: '9876543213',
          dob: '2000-11-02',
          gender: 'Male',
          aadhaar: '333344445555',
          address: 'Ahmedabad, Gujarat',
          college: 'Nirma University',
          studentStatus: 'Passed Out',
          workStatus: 'Working',
          reason: 'Validating cloud architecture competencies',
          registeredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'std-4',
          fullName: 'Sanjana Roy',
          email: 'sanjana@example.com',
          mobile: '9876543214',
          dob: '2003-02-14',
          gender: 'Female',
          aadhaar: '444455556666',
          address: 'Kolkata, West Bengal',
          college: 'Jadavpur University',
          studentStatus: 'Current Student',
          workStatus: 'Not Working',
          reason: 'Learning foundational software engineering workflows',
          registeredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'std-5',
          fullName: 'Sanjay Naveen',
          email: 'sanjay@example.com',
          mobile: '9876543210',
          dob: '2002-01-01',
          gender: 'Male',
          aadhaar: '123456789012',
          address: 'Bangalore, India',
          college: 'RV College of Engineering',
          studentStatus: 'Current Student',
          workStatus: 'Not Working',
          reason: 'To unlock inclusive opportunities through tech training',
          registeredAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('registered_students', JSON.stringify(mockStudents));
      setRegisteredStudents(mockStudents);
    }

    // 4. Load current user quiz status
    const currentUserQuiz = localStorage.getItem('current_user_quiz');
    if (currentUserQuiz) {
      const parsed = JSON.parse(currentUserQuiz);
      setQuizResult({
        correct: parsed.score,
        wrong: parsed.totalQuestions - parsed.score,
        scorePercent: (parsed.score / parsed.totalQuestions) * 100,
        couponCode: parsed.couponCode,
        generatedTime: parsed.generatedAt
      });
      setSelectedProgram(parsed.program);
      setQuizStatus('result');
    }
  }, []);

  // Reset pagination pages when filters change
  useEffect(() => {
    setAttemptsPage(1);
  }, [adminProgramFilter]);

  useEffect(() => {
    setStudentsPage(1);
  }, [studentSearchQuery]);

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

  // Generate Coupon Code
  const generateCouponCode = (programName: string): string => {
    const words = programName.toUpperCase().split(' ');
    const prefix = words.map(w => w[0]).join('').substring(0, 3);
    const year = new Date().getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let randomStr = '';
    for (let i = 0; i < 5; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}${year}${randomStr}`;
  };

  // Start the Quiz
  const handleStartQuiz = () => {
    if (!selectedProgram) return;
    const questions = activeQuestions[selectedProgram];
    if (!questions || questions.length !== 10) {
      alert('This program does not have exactly 10 questions. It must be configured with 10 questions to attempt.');
      return;
    }
    setStartedQuiz(true);
    setQuizStatus('assessment');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  // Handle option choice click
  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    const questions = activeQuestions[selectedProgram];
    if (!questions) return;

    if (Object.keys(userAnswers).length < questions.length) {
      alert('Please answer all 10 questions before submitting.');
      return;
    }

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const wrongCount = questions.length - correctCount;
    const scorePercent = (correctCount / questions.length) * 100;
    const generatedCoupon = generateCouponCode(selectedProgram);
    const generatedTime = new Date().toISOString();

    const result = {
      correct: correctCount,
      wrong: wrongCount,
      scorePercent,
      couponCode: generatedCoupon,
      generatedTime
    };

    setQuizResult(result);
    setQuizStatus('result');

    // Save in localStorage
    const userQuizData = {
      program: selectedProgram,
      score: correctCount,
      totalQuestions: questions.length,
      couponCode: generatedCoupon,
      generatedAt: generatedTime,
      quizCompletionStatus: 'completed'
    };
    localStorage.setItem('current_user_quiz', JSON.stringify(userQuizData));

    // Append attempt
    const newAttempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      candidateName: 'Sanjay Naveen',
      program: selectedProgram,
      score: correctCount,
      totalQuestions: questions.length,
      couponCode: generatedCoupon,
      generatedAt: generatedTime,
      status: 'completed'
    };

    const updatedAttempts = [...attempts, newAttempt];
    localStorage.setItem('quiz_attempts', JSON.stringify(updatedAttempts));
    setAttempts(updatedAttempts);
  };

  // Format Helper
  const formatDateTime = (isoString: string) => {
    const d = new Date(isoString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Expiry Checker
  const getCouponStatus = (isoString: string) => {
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
    const csvHeaders = ['Candidate Name', 'Selected Program', 'Score', 'Coupon Code', 'Generated At', 'Expiry Status'];
    const csvRows = attempts.map(att => {
      const { text } = getCouponStatus(att.generatedAt);
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
    const csvHeaders = ['Full Name', 'Email ID', 'Mobile Number', 'Date of Birth', 'Gender', 'Aadhaar Number', 'College Name', 'Student Status', 'Working Status', 'Registered At'];
    const csvRows = registeredStudents.map(std => {
      return [
        `"${std.fullName}"`,
        `"${std.email}"`,
        `"${std.mobile}"`,
        `"${std.dob}"`,
        `"${std.gender}"`,
        `"${std.aadhaar}"`,
        `"${std.college}"`,
        `"${std.studentStatus}"`,
        `"${std.workStatus}"`,
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

  // Reset helper
  const handleResetQuizDemo = () => {
    localStorage.removeItem('current_user_quiz');
    setQuizResult(null);
    setSelectedProgram('');
    setStartedQuiz(false);
    setQuizStatus('selection');
    setUserAnswers({});
    const filtered = attempts.filter(att => att.candidateName !== 'Sanjay Naveen');
    localStorage.setItem('quiz_attempts', JSON.stringify(filtered));
    setAttempts(filtered);
  };

  // ADMIN ACTION: Add Training Program
  const handleAddProgram = (e: React.FormEvent) => {
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

    const updated = { ...activeQuestions, [name]: [] };
    setActiveQuestions(updated);
    localStorage.setItem('custom_questions', JSON.stringify(updated));
    setNewProgramName('');
    setTargetProgramForQuestion(name);
    alert(`Training program "${name}" created successfully. Now configure the quiz questions in the "Manage Quizzes" tab.`);
  };

  // ADMIN ACTION: Delete a Training Program entirely
  const handleDeleteProgram = (progName: string) => {
    if (!window.confirm(`Are you sure you want to delete the program "${progName}"? This will delete all its questions.`)) return;
    const updated = { ...activeQuestions };
    delete updated[progName];
    setActiveQuestions(updated);
    localStorage.setItem('custom_questions', JSON.stringify(updated));
    if (targetProgramForQuestion === progName) {
      setTargetProgramForQuestion('');
    }
  };

  // ADMIN ACTION: Add Quiz Question
  const handleAddQuestion = (e: React.FormEvent) => {
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
    if (programQs.length >= 10) {
      alert('This quiz already has 10 questions. Delete or clear questions to add new ones.');
      return;
    }

    const newQ: Question = {
      id: Date.now(),
      questionText: newQuestionText.trim(),
      options: newOptions.map(o => o.trim()),
      correctIndex: correctOptionIdx
    };

    const updated = {
      ...activeQuestions,
      [targetProgramForQuestion]: [...programQs, newQ]
    };

    setActiveQuestions(updated);
    localStorage.setItem('custom_questions', JSON.stringify(updated));

    // Reset fields
    setNewQuestionText('');
    setNewOptions(['', '', '', '']);
    setCorrectOptionIdx(0);
    alert(`Question added successfully! (${programQs.length + 1} of 10)`);
  };

  // ADMIN ACTION: Delete a student registration
  const handleDeleteStudent = (studentId: string) => {
    if (!window.confirm('Are you sure you want to remove this registered student record?')) return;
    const updated = registeredStudents.filter(std => std.id !== studentId);
    setRegisteredStudents(updated);
    localStorage.setItem('registered_students', JSON.stringify(updated));
  };

  // ADMIN ACTION: Quick mock generate questions (for testing convenience)
  const handleQuickGenerateMock = (progName: string) => {
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
          `Alternative database interface #${i}`
        ],
        correctIndex: (i % 4)
      });
    }

    const updated = {
      ...activeQuestions,
      [progName]: [...(activeQuestions[progName] || []), ...generated]
    };
    setActiveQuestions(updated);
    localStorage.setItem('custom_questions', JSON.stringify(updated));
    alert(`Instantly generated ${needed} questions for "${progName}". It is now ready for candidate validation tests!`);
  };

  // ADMIN ACTION: Clear all questions inside a program
  const handleClearProgramQuestions = (progName: string) => {
    if (!window.confirm(`Are you sure you want to clear all questions for "${progName}"?`)) return;
    const updated = { ...activeQuestions, [progName]: [] };
    setActiveQuestions(updated);
    localStorage.setItem('custom_questions', JSON.stringify(updated));
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

  return (
    <div className="dash-layout">
      {/* Sidebar Navigation */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-header">
          <h2 style={{ color: '#FFB800', margin: 0, fontSize: '20px', fontWeight: 800 }}>ERP HUB Portal</h2>
          <span style={{ fontSize: '11px', color: '#94a3b8', letterSpacing: '0.5px' }}>LEARNER SPACE</span>
        </div>

        <nav className="dash-sidebar-menu">
          {!isAdminMode ? (
            <>
              <button
                className={`dash-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </button>
              <button
                className={`dash-menu-item ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <BookOpen size={18} />
                Quiz
              </button>
            </>
          ) : (
            <>
              <button
                className={`dash-menu-item ${adminSubTab === 'attempts' ? 'active' : ''}`}
                onClick={() => setAdminSubTab('attempts')}
              >
                <ListFilter size={18} />
                Learner Attempts
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'students' ? 'active' : ''}`}
                onClick={() => setAdminSubTab('students')}
              >
                <Users size={18} />
                Registered Students
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'programs' ? 'active' : ''}`}
                onClick={() => setAdminSubTab('programs')}
              >
                <FolderOpen size={18} />
                Manage Programs
              </button>
              <button
                className={`dash-menu-item ${adminSubTab === 'quizzes' ? 'active' : ''}`}
                onClick={() => setAdminSubTab('quizzes')}
              >
                <PlusCircle size={18} />
                Manage Quizzes
              </button>
            </>
          )}
        </nav>

        {/* User Context bottom block */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FFB800', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              SN
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>Sanjay Naveen</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>SIDEP Candidate</div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/login')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dash-content">
        
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>
              {isAdminMode ? 'Admin Dashboard' : activeTab === 'dashboard' ? 'Welcome back, Sanjay!' : 'SIDEP Assessment'}
            </h1>
            <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
              {isAdminMode ? 'Monitor quiz attempts, track registered students, configure training programs, and authorize evaluation quizzes.' : 'Digital Empowerment & Skill Validation Hub.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleResetQuizDemo}
              style={{ padding: '8px 16px', background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
              title="Reset Quiz state to retake"
            >
              Reset Quiz Status
            </button>

            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setActiveTab('dashboard');
                setAdminSubTab('attempts');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: isAdminMode ? '#FFB800' : '#0f172a',
                color: isAdminMode ? '#0f172a' : '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '13px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              <Sliders size={14} />
              {isAdminMode ? 'Switch to Student View' : 'Switch to Admin View'}
            </button>
          </div>
        </div>

        {/* ---------------- STUDENT MODE ---------------- */}
        {!isAdminMode && (
          <>
            {/* TABS: DASHBOARD CONTENT */}
            {activeTab === 'dashboard' && (
              <div>
                {/* Stats Grid */}
                <div className="dash-grid-3" style={{ marginBottom: '32px' }}>
                  <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>Program Status</span>
                      <strong style={{ fontSize: '20px', fontWeight: 800 }}>Enrolled</strong>
                    </div>
                  </div>

                  <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

                  <div className="dash-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#64748b', display: 'block' }}>Coupon Status</span>
                      <strong style={{ fontSize: '20px', fontWeight: 800 }}>
                        {quizResult ? getCouponStatus(quizResult.generatedTime).text : 'No Coupon Generated'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Main Dashboard Panel */}
                <div className="dash-card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>SIDEP Candidate Overview</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    Welcome to the Social Initiative & Digital Empowerment Program candidate portal. Use this portal to complete your skills validation assessment.
                  </p>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>My Registration Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', fontSize: '14px' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>EMAIL ID</span>
                        <strong>sanjay@example.com</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>MOBILE NUMBER</span>
                        <strong>+91 9876543210</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '12px' }}>EDUCATION STATUS</span>
                        <strong>Current Student</strong>
                      </div>
                    </div>
                  </div>

                  {quizResult && (
                    <div style={{ marginTop: '32px', background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}>
                        <Award style={{ color: '#FFB800' }} size={20} />
                        Your Active Coupon Code
                      </h4>
                      <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0' }}>
                        You completed the <strong>{selectedProgram}</strong> assessment. Here is your digital empowerment coupon. Our team will contact you shortly.
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
                    <div style={{ marginTop: '32px', background: '#fffbeb', border: '1px solid #fde68a', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <AlertTriangle style={{ color: '#d97706' }} size={24} />
                        <div>
                          <strong style={{ color: '#92400e', fontSize: '14px' }}>Skills Assessment Pending</strong>
                          <span style={{ display: 'block', fontSize: '13px', color: '#b45309' }}>Please take your assessment to unlock your program coupon code.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('quiz')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}
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
                      {Object.keys(activeQuestions).map((programName) => {
                        const qCount = activeQuestions[programName]?.length || 0;
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
                        disabled={!selectedProgram || activeQuestions[selectedProgram]?.length !== 10}
                        className="btn btn-primary"
                        style={{
                          background: '#0f172a',
                          borderColor: '#0f172a',
                          color: '#fff',
                          padding: '12px 28px',
                          fontSize: '14px',
                          fontWeight: 700,
                          opacity: (selectedProgram && activeQuestions[selectedProgram]?.length === 10) ? 1 : 0.5,
                          cursor: (selectedProgram && activeQuestions[selectedProgram]?.length === 10) ? 'pointer' : 'not-allowed'
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
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
                      const questions = activeQuestions[selectedProgram];
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', marginTop: '32px', paddingTop: '24px' }}>
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
                          style={{
                            padding: '10px 28px',
                            background: '#16a34a',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Submit Assessment
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

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
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

                      {/* Coupon Box */}
                      <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ color: '#047857', fontWeight: 800, fontSize: '18px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Award />
                          Assessment Completed Successfully!
                        </div>
                        
                        <div style={{ display: 'inline-flex', background: '#10b981', color: '#fff', fontSize: '24px', fontWeight: 900, padding: '10px 28px', borderRadius: '8px', letterSpacing: '2px', margin: '8px 0 16px' }}>
                          {quizResult.couponCode}
                        </div>

                        <p style={{ color: '#065f46', fontSize: '13px', maxWidth: '580px', margin: '0 auto 16px', lineHeight: 1.6 }}>
                          "Congratulations! You have successfully completed the assessment. Your coupon code is valid for 72 hours from the time of generation. Please use it before it expires. Our team will contact you shortly."
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
        {isAdminMode && (
          <div>
            {/* SUBTAB 1: ATTEMPTS LIST */}
            {adminSubTab === 'attempts' && (
              <div className="dash-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>SIDEP Learner Quiz Attempts</h3>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Track student grades, codes generated, and code duration status.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
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
                      onClick={handleExportAttemptsCSV}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600
                      }}
                    >
                      <Download size={14} />
                      Export Results (CSV)
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Candidate Name</th>
                        <th>Selected Program</th>
                        <th>Score</th>
                        <th>Coupon Code</th>
                        <th>Generated Date &amp; Time</th>
                        <th>Coupon Expiry Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAttempts.map(att => {
                        const expiry = getCouponStatus(att.generatedAt);
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>Registered Students Profile List</h3>
                    <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>Review registrations and applications completed on the portal.</p>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {/* Search Input */}
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Search student or college..."
                        value={studentSearchQuery}
                        onChange={(e) => setStudentSearchQuery(e.target.value)}
                        style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '240px', outline: 'none' }}
                      />
                      <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>

                    <button
                      onClick={handleExportStudentsCSV}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 16px',
                        background: '#16a34a',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600
                      }}
                    >
                      <Download size={14} />
                      Export Students (CSV)
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email &amp; Mobile</th>
                        <th>DOB &amp; Gender</th>
                        <th>Aadhaar Number</th>
                        <th>College / Institution</th>
                        <th>Status (Edu / Job)</th>
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
                            <div>{std.dob}</div>
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
                          <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PlusCircle style={{ color: '#16a34a' }} size={20} />
                    Add Quiz Question
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>
                    Configure specific multiple-choice assessment questions for an existing training program.
                  </p>

                  <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div className="register-form-group">
                      <label htmlFor="adminSelectProg">Select Training Program *</label>
                      <select
                        id="adminSelectProg"
                        value={targetProgramForQuestion}
                        onChange={(e) => setTargetProgramForQuestion(e.target.value)}
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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

                    <button type="submit" className="btn btn-primary" style={{ background: '#16a34a', borderColor: '#16a34a', color: '#fff', width: 'fit-content' }}>
                      Add Question to Quiz
                    </button>
                  </form>
                </div>

                <div className="dash-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 8px 0' }}>Quiz Status & Quick Tools</h3>
                  <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 20px 0' }}>
                    Select a program to review its question count, clear questions, or auto-fill mock entries.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Object.keys(activeQuestions).map(pName => {
                      const count = activeQuestions[pName]?.length || 0;
                      return (
                        <div key={pName} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '14px', color: '#0f172a' }}>{pName}</strong>
                            <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                              Questions configured: <strong>{count} of 10</strong>
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {count < 10 && (
                              <button
                                onClick={() => handleQuickGenerateMock(pName)}
                                className="btn btn-secondary"
                                style={{ padding: '8px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Autofill remaining questions with high-quality mock data"
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
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
