import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_LOGO_URL, BRAND_LOGO_HEADER_URL, BRAND_ALT } from '../constants/brand';
import {
  ChevronDown,
  Cpu,
  Smartphone,
  Layers,
  Cloud,
  Infinity as InfinityIcon,
  Bot,
  Brain,
  Network,
  Compass,
  Palette,
  Workflow,
  Terminal,
  ShieldCheck,
  X,
  Landmark,
  ShoppingCart,
  GraduationCap,
  Factory,
  Info,
  BookOpen,
  Briefcase,
  CheckCircle,
  ArrowRight,
  BarChart3,
  RefreshCw,
  Users,
  UserCheck,
  LayoutDashboard,
  Kanban,
  BookMarked,
  ClipboardCheck,
  Wallet,
  Megaphone,
  BriefcaseBusiness,
  Crown,
  Lock,
  Sparkles,
  Monitor,
  Shield,
  LogIn,
  Eye,
  Target,
  TrendingUp,
  AlertTriangle,
  Code2,
  LineChart,
  Wand2,
  MessageSquare,
} from 'lucide-react';

const AI_FEATURES = [
  {
    id: 'lead-scoring',
    icon: Target,
    title: 'AI Lead Scoring',
    description: 'Automatically ranks incoming enquiries by conversion probability, course fit, and engagement signals — so BDEs focus on the hottest leads first.',
    color: '#FFB800',
    module: 'Leads CRM',
  },
  {
    id: 'student-risk',
    icon: AlertTriangle,
    title: 'Student Risk Detection',
    description: 'Flags at-risk students when attendance drops, fees are overdue, or LMS activity falls — surfaced directly on the owner dashboard as priority tasks.',
    color: '#EF4444',
    module: 'Dashboard',
  },
  {
    id: 'revenue-forecast',
    icon: LineChart,
    title: 'Revenue & Dues Forecasting',
    description: 'Predicts collected fees vs outstanding dues using enrollment trends and payment history — powering the revenue stream charts on your IMS dashboard.',
    color: '#22C55E',
    module: 'Analytics',
  },
  {
    id: 'bde-routing',
    icon: TrendingUp,
    title: 'Smart BDE Assignment',
    description: 'AI routes new leads to the best-matched BDE based on course expertise, current workload, conversion rate, and monthly target progress.',
    color: '#00E5FF',
    module: 'BDE Management',
  },
  {
    id: 'code-evaluation',
    icon: Code2,
    title: 'AI Code Assessment',
    description: 'Evaluates student code submissions in the LMS with automated scoring, compiler feedback, and plagiarism checks — built into the online compiler workflow.',
    color: '#A855F7',
    module: 'LMS',
  },
  {
    id: 'funnel-intelligence',
    icon: Kanban,
    title: 'Conversion Funnel Intelligence',
    description: 'Analyzes pipeline bottlenecks across New → Contacted → Interested → Demo → Converted stages and suggests actions to improve conversion rates.',
    color: '#F97316',
    module: 'Leads CRM',
  },
  {
    id: 'attendance-predict',
    icon: ClipboardCheck,
    title: 'Predictive Attendance Alerts',
    description: 'Detects unusual absence patterns across batches before they become problems — alerting trainers and admins with schedule-aware insights.',
    color: '#3B82F6',
    module: 'Attendance',
  },
  {
    id: 'campaign-ai',
    icon: Megaphone,
    title: 'AI Campaign Optimizer',
    description: 'Recommends the best lead segments, courses, and outreach timing for marketing campaigns — maximizing enrollment ROI with data-driven targeting.',
    color: '#EC4899',
    module: 'Campaigns',
  },
  {
    id: 'ai-assistant',
    icon: MessageSquare,
    title: 'Institute AI Assistant',
    description: 'Built-in conversational assistant helps owners and staff query institute data — enrollment stats, fee summaries, and lead reports in natural language.',
    color: '#14B8A6',
    module: 'All Portals',
  },
];

const BG_PARTICLES = [
  { left: '8%', top: '15%', delay: '0s', duration: '7s', size: 3 },
  { left: '22%', top: '72%', delay: '1.2s', duration: '9s', size: 2 },
  { left: '45%', top: '28%', delay: '0.5s', duration: '6s', size: 4 },
  { left: '67%', top: '55%', delay: '2s', duration: '8s', size: 2 },
  { left: '85%', top: '20%', delay: '1.8s', duration: '10s', size: 3 },
  { left: '12%', top: '88%', delay: '0.8s', duration: '7s', size: 2 },
  { left: '55%', top: '8%', delay: '2.5s', duration: '11s', size: 3 },
  { left: '78%', top: '78%', delay: '1s', duration: '8s', size: 4 },
  { left: '33%', top: '45%', delay: '3s', duration: '9s', size: 2 },
  { left: '92%', top: '42%', delay: '0.3s', duration: '6s', size: 2 },
  { left: '18%', top: '38%', delay: '1.5s', duration: '10s', size: 3 },
  { left: '62%', top: '92%', delay: '2.2s', duration: '7s', size: 2 },
  { left: '40%', top: '65%', delay: '0.6s', duration: '8s', size: 3 },
  { left: '95%', top: '65%', delay: '1.7s', duration: '9s', size: 2 },
  { left: '5%', top: '52%', delay: '2.8s', duration: '11s', size: 4 },
  { left: '72%', top: '35%', delay: '0.9s', duration: '7s', size: 2 },
  { left: '28%', top: '12%', delay: '3.2s', duration: '8s', size: 3 },
  { left: '50%', top: '82%', delay: '1.1s', duration: '10s', size: 2 },
  { left: '88%', top: '8%', delay: '2.4s', duration: '6s', size: 3 },
  { left: '38%', top: '22%', delay: '0.4s', duration: '9s', size: 2 },
];

function ProductAnimatedBg({ variant = 'hero' }: { variant?: 'hero' | 'section' }) {
  return (
    <div className={`product-animated-bg ${variant === 'section' ? 'product-animated-bg-section' : ''}`} aria-hidden="true">
      <div className="product-orb product-orb-1" />
      <div className="product-orb product-orb-2" />
      <div className="product-orb product-orb-3" />
      {variant === 'hero' && <div className="product-orb product-orb-4" />}
      <div className="product-grid-overlay product-grid-animate" />
      <div className="product-scan-line" />
      <div className="product-circuit-lines">
        <span className="product-circuit-line product-circuit-line-1" />
        <span className="product-circuit-line product-circuit-line-2" />
        <span className="product-circuit-line product-circuit-line-3" />
      </div>
      <div className="product-pulse-rings">
        <span className="product-pulse-ring" />
        <span className="product-pulse-ring product-pulse-ring-2" />
      </div>
      <div className="product-particles">
        {BG_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="product-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>
      <div className="product-data-nodes">
        <span className="product-data-node" style={{ left: '20%', top: '30%' }} />
        <span className="product-data-node" style={{ left: '70%', top: '25%', animationDelay: '1s' }} />
        <span className="product-data-node" style={{ left: '60%', top: '70%', animationDelay: '2s' }} />
        <span className="product-data-node" style={{ left: '35%', top: '80%', animationDelay: '0.5s' }} />
      </div>
    </div>
  );
}

const LOGIN_ROLES = [
  {
    id: 'owner',
    title: 'Owner Portal',
    role: 'Institute Owner / Admin',
    icon: Crown,
    color: '#FFB800',
    gradient: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)',
    description:
      'The master command center. Owners get full visibility across every branch — revenue, leads, attendance, enrollments, staff performance, and risk alerts — all from one powerful IMS dashboard.',
    features: ['Full IMS Dashboard access', 'Revenue & dues analytics', 'Multi-branch oversight', 'Staff & permission management', 'Export reports & HR payroll'],
    image: '/assets/products/erp-suite/dashboard.png',
    portalLabel: 'owner.erphub.app',
  },
  {
    id: 'bde',
    title: 'BDE Login',
    role: 'Business Development Executive',
    icon: Target,
    color: '#00E5FF',
    gradient: 'linear-gradient(135deg, #00E5FF 0%, #4facfe 100%)',
    description:
      'Dedicated sales portal for BDE staff. Manage assigned leads, track conversion stages, hit monthly revenue targets, and log daily attendance — without accessing sensitive institute-wide data.',
    features: ['Personal lead pipeline', 'Conversion stage tracking', 'Monthly target dashboard', 'Lead assignment inbox', 'Individual attendance logs'],
    image: '/assets/products/erp-suite/bde-management.png',
    portalLabel: 'bde.erphub.app',
  },
  {
    id: 'trainer',
    title: 'Trainer Portal',
    role: 'Faculty / Instructor',
    icon: GraduationCap,
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
    description:
      'Faculty members log in to view assigned batches, manage LMS content, mark attendance, track student progress, and receive feedback ratings — all scoped to their courses only.',
    features: ['Assigned batch schedule', 'LMS content management', 'Roll call & QR attendance', 'Student progress view', 'Rating & feedback panel'],
    image: '/assets/products/erp-suite/trainers.png',
    portalLabel: 'trainer.erphub.app',
  },
  {
    id: 'student',
    title: 'Student Portal',
    role: 'Enrolled Student',
    icon: UserCheck,
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    description:
      'Students access their personalized learning portal — view course materials, join live Google Meet sessions, check fee dues, track attendance percentage, and download certificates.',
    features: ['LMS course access', 'Live session links', 'Fee & installment view', 'Attendance history', 'Certificate downloads'],
    image: '/assets/products/erp-suite/lms.png',
    portalLabel: 'student.erphub.app',
  },
  {
    id: 'staff',
    title: 'Staff & HR Login',
    role: 'Operations / HR Staff',
    icon: Users,
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    description:
      'Operations and HR staff manage day-to-day institute workflows — student enrollments, fee collections, attendance terminals, payroll processing, and campaign management with role-scoped permissions.',
    features: ['Student enrollment desk', 'Fees & dues collection', 'Attendance terminal', 'Payroll & HR records', 'Campaign management'],
    image: '/assets/products/erp-suite/students.png',
    portalLabel: 'staff.erphub.app',
  },
];

const PRODUCT_MODULES = [
  {
    id: 'dashboard',
    title: 'IMS Dashboard',
    tagline: 'Real-time institute intelligence at a glance',
    description:
      'Monitor active leads, monthly income, attendance rates, and course enrollments from a unified command center. Revenue stream charts, conversion funnels, and activity feeds give owners instant visibility across every branch.',
    image: '/assets/products/erp-suite/dashboard.png',
    alt: 'EduPlatform IMS Dashboard showing KPIs, revenue charts, and conversion funnel',
    highlights: ['Live KPI cards', 'Revenue vs dues tracking', 'Conversion funnel analytics', 'Activity feed & risk alerts'],
  },
  {
    id: 'leads-crm',
    title: 'Leads CRM Board',
    tagline: 'Convert inquiries into enrolled students',
    description:
      'Manage your entire student intake pipeline with pipeline and table views. Track lead name, contact details, course enquiries, intake value, stage, assigned BDE, and registration dates — with import and bulk-add capabilities.',
    image: '/assets/products/erp-suite/leads-crm.png',
    alt: 'Leads CRM Board with student lead table and pipeline view',
    highlights: ['Pipeline & table views', 'Course-wise filtering', 'BDE assignment', 'Stage tracking to conversion'],
  },
  {
    id: 'bde-management',
    title: 'BDE Executive Management',
    tagline: 'Empower your sales team to hit targets',
    description:
      'Monitor calling conversions, assign pipelines, and manage permissions for Business Development Executives. Track assigned leads, conversion rates, monthly targets, revenue generated, and weekly off schedules.',
    image: '/assets/products/erp-suite/bde-management.png',
    alt: 'BDE Executive Management directory with performance metrics',
    highlights: ['Performance comparison', 'Lead assignment', 'Revenue & target tracking', 'Attendance logs'],
  },
  {
    id: 'students',
    title: 'Students Directory',
    tagline: 'Complete student lifecycle management',
    description:
      'Administer student profiles, attendance analytics, document deposits, and installment schedules. Filter by status, course, and batch — with enrollment limits and plan-based capacity controls built in.',
    image: '/assets/products/erp-suite/students.png',
    alt: 'Students Directory with enrollment, fees, and attendance data',
    highlights: ['Fee installment tracking', 'Attendance percentage', 'Multi-filter search', 'Enrollment capacity alerts'],
  },
  {
    id: 'trainers',
    title: 'Trainer Faculty Ledger',
    tagline: 'Manage your teaching workforce',
    description:
      'Register and manage faculty members with specialized courses, schedules, and quality rating insights. Track batches assigned, weekly hours, ratings, and employment status — with full-time and part-time support.',
    image: '/assets/products/erp-suite/trainers.png',
    alt: 'Trainer Faculty Ledger with profile and performance metrics',
    highlights: ['Skill & experience tracking', 'Batch assignments', 'Rating & feedback', 'Online/offline modes'],
  },
  {
    id: 'courses-batches',
    title: 'Courses & Batches',
    tagline: 'Structure your academic offerings',
    description:
      'Overview of course syllabus offerings, class capacities, schedules, and teacher assignments. Create course programs, launch batches, track enrollment progress, and mark batches complete when finished.',
    image: '/assets/products/erp-suite/courses-batches.png',
    alt: 'Courses and Batches management with schedule and enrollment tracking',
    highlights: ['Course program builder', 'Batch scheduling', 'Instructor assignment', 'Enrollment progress bars'],
  },
  {
    id: 'lms',
    title: 'LMS Ecosystem',
    tagline: 'Deliver learning experiences online',
    description:
      'Manage video modules, evaluate code submissions, launch real-time online compilers, and verify course certificates. Toggle LMS portal access per course with integrated Google Meet for live sessions.',
    image: '/assets/products/erp-suite/lms.png',
    alt: 'LMS Ecosystem with enrolled courses and portal access settings',
    highlights: ['Video module delivery', 'Google Meet integration', 'Portal access controls', 'Certificate verification'],
  },
  {
    id: 'attendance',
    title: 'Attendance Operations',
    tagline: 'Accurate daily check-ins for everyone',
    description:
      'Log daily check-ins for students, trainers, and BDE staff. Support roll call and QR check-in modes, audit terminal logs, and configure hardware readers — all tied to batch schedules and ledger dates.',
    image: '/assets/products/erp-suite/attendance.png',
    alt: 'Student Attendance terminal with roll call and QR check-in',
    highlights: ['Student, trainer & BDE tabs', 'QR check-in support', 'Batch-wise marking', 'Schedule-aware logging'],
  },
];

const ADDITIONAL_MODULES = [
  { icon: Wallet, title: 'Fees & Dues', desc: 'Collect fees, track installments, and manage outstanding dues.' },
  { icon: BriefcaseBusiness, title: 'Job Portal', desc: 'Connect students with placement opportunities and hiring partners.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Deep reporting across leads, revenue, attendance, and operations.' },
  { icon: Megaphone, title: 'Campaigns', desc: 'Run marketing campaigns and track outreach performance.' },
  { icon: Users, title: 'Staff Payroll & HR', desc: 'Manage payroll, HR records, and staff operations in one place.' },
];

export default function ErpSuite() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenus, setMobileSubmenus] = useState<{ [key: string]: boolean }>({
    services: false,
    products: false,
    whoWeAre: false,
  });
  const [activeModule, setActiveModule] = useState(0);
  const [activeRole, setActiveRole] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      setIsFormSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 300);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const stateKey = id.replace('client', '').toLowerCase();
    setFormData(prev => ({ ...prev, [stateKey]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  const toggleMobileSubmenu = (key: string) => {
    setMobileSubmenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <div
        className={`mega-menu-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => { setIsMobileMenuOpen(false); closeContactModal(); }}
      />

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <Link to="/" className="logo logo-brand-image">
            <img src={BRAND_LOGO_HEADER_URL} alt={BRAND_ALT} className="logo-image" />
          </Link>

          <nav className="nav-menu">
            <ul className="nav-list">
              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link">Services <ChevronDown className="chevron-icon" /></a>
                <div className="mega-menu mega-menu-3col">
                  <div className="mega-col">
                    <h3>Product Engineering</h3>
                    <ul>
                      <li><Link to="/"><Cpu className="menu-icon" /> Software Engineering</Link></li>
                      <li><Link to="/"><Smartphone className="menu-icon" /> Mobile Engineering</Link></li>
                      <li><Link to="/"><Layers className="menu-icon" /> Product Development</Link></li>
                    </ul>
                    <h3>Cloud & DevOps</h3>
                    <ul>
                      <li><Link to="/"><Cloud className="menu-icon" /> Cloud Consulting</Link></li>
                      <li><Link to="/"><InfinityIcon className="menu-icon" /> DevOps Consulting</Link></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Artificial Intelligence</h3>
                    <ul>
                      <li><Link to="/"><Bot className="menu-icon" /> AI Development</Link></li>
                      <li><Link to="/"><Brain className="menu-icon" /> AI As A Service</Link></li>
                      <li><Link to="/"><Network className="menu-icon" /> ML Development</Link></li>
                    </ul>
                    <h3>Strategy & Design</h3>
                    <ul>
                      <li><Link to="/"><Compass className="menu-icon" /> Product Strategy</Link></li>
                      <li><Link to="/"><Palette className="menu-icon" /> Experience Design</Link></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Systems Implementation</h3>
                    <ul>
                      <li><Link to="/"><Workflow className="menu-icon" /> ServiceNow Implementation</Link></li>
                      <li><Link to="/"><Terminal className="menu-icon" /> Microsoft Enterprise Dev</Link></li>
                      <li><Link to="/"><ShieldCheck className="menu-icon" /> Software Testing</Link></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link to="/#tech-stack-section" className="nav-link">Technologies</Link>
              </li>

              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link nav-link-active" onClick={(e) => e.preventDefault()}>
                  Products <ChevronDown className="chevron-icon" />
                </a>
                <div className="mega-menu mega-menu-2col">
                  <div className="mega-col">
                    <h3>Core Products</h3>
                    <ul>
                      <li><Link to="/products/erp-suite"><Factory className="menu-icon" /> ERP Suite</Link></li>
                      <li><a href="#"><Briefcase className="menu-icon" /> CRM Platform</a></li>
                      <li><a href="#"><GraduationCap className="menu-icon" /> HRMS & Payroll</a></li>
                      <li><a href="#"><ShoppingCart className="menu-icon" /> Inventory Management</a></li>
                      <li><a href="#"><Landmark className="menu-icon" /> Accounting & Finance</a></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Enterprise Products</h3>
                    <ul>
                      <li><a href="#"><Workflow className="menu-icon" /> ServiceNow Solutions</a></li>
                      <li><a href="#"><BarChart3 className="menu-icon" /> BI & Analytics</a></li>
                      <li><a href="#"><RefreshCw className="menu-icon" /> Workflow Automation</a></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link" onClick={(e) => e.preventDefault()}>
                  Who We Are <ChevronDown className="chevron-icon" />
                </a>
                <div className="mega-menu mega-menu-2col">
                  <div className="mega-col">
                    <h3>About Our Company</h3>
                    <ul>
                      <li><Link to="/about"><Info className="menu-icon" /> About Us</Link></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Social Initiative</h3>
                    <ul>
                      <li><Link to="/sidep"><BookOpen className="menu-icon" /> SIDEP</Link></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link to="/#case-studies-section" className="nav-link">Success Stories</Link>
              </li>
            </ul>
          </nav>

          <div className="header-ctas">
            <button className="btn btn-primary open-contact-btn" onClick={openContactModal}>Contact Us</button>
            <button
              className={`burger-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
              aria-label="Toggle Navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav-sidebar ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <Link to="/" className="logo logo-brand-image">
            <img src={BRAND_LOGO_HEADER_URL} alt={BRAND_ALT} className="logo-image logo-image-sm" />
          </Link>
          <button className="close-sidebar-btn" onClick={() => setIsMobileMenuOpen(false)}><X /></button>
        </div>
        <div className="mobile-nav-body">
          <ul className="mobile-nav-list">
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('services')}>
                Services
                <ChevronDown style={{ transform: mobileSubmenus.services ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.services ? 'active' : ''}`}>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Software Engineering</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Product Development</Link></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <Link to="/#tech-stack-section" onClick={() => setIsMobileMenuOpen(false)}>Technologies</Link>
            </li>
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('products')}>
                Products
                <ChevronDown style={{ transform: mobileSubmenus.products ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.products ? 'active' : ''}`}>
                <li><Link to="/products/erp-suite" onClick={() => setIsMobileMenuOpen(false)}>ERP Suite</Link></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>CRM Platform</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>HRMS & Payroll</a></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('whoWeAre')}>
                Who We Are
                <ChevronDown style={{ transform: mobileSubmenus.whoWeAre ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.whoWeAre ? 'active' : ''}`}>
                <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
                <li><Link to="/sidep" onClick={() => setIsMobileMenuOpen(false)}>SIDEP</Link></li>
              </ul>
            </li>
          </ul>
          <button className="btn btn-primary mobile-cta-btn open-contact-btn" onClick={openContactModal}>Contact Us</button>
        </div>
      </div>

      <main className="erp-suite-page">
        {/* Hero */}
        <section className="product-hero-section">
          <ProductAnimatedBg variant="hero" />
          <div className="product-hero-container">
            <div className="product-hero-content">
              <h1>
                EduPlatform
                <span className="gradient-text"> ERP Suite</span>
              </h1>
              <p className="product-hero-subtitle">
                The all-in-one Institute Management System with <strong>5 dedicated login portals</strong> — built for owners, sales teams, trainers, students, and staff. One platform, role-perfect experiences.
              </p>
              <div className="product-hero-badges">
                <span className="product-badge"><Brain size={12} /> AI-Powered</span>
                <span className="product-badge"><Lock size={12} /> Multi-Login System</span>
                <span className="product-badge"><Shield size={12} /> Role-Based Access</span>
                <span className="product-badge"><Monitor size={12} /> Enterprise CRM v1.2</span>
                <span className="product-badge"><Smartphone size={12} /> Multi-Tenant SaaS</span>
              </div>
              <div className="product-hero-actions">
                <button className="btn btn-primary btn-large product-glow-btn" onClick={openContactModal}>
                  Request a Demo <ArrowRight className="btn-arrow" />
                </button>
                <a href="#multi-login" className="btn btn-secondary btn-large">See Login Portals</a>
              </div>
              <div className="product-hero-trust">
                <div className="product-trust-item"><CheckCircle size={16} /> 15+ Integrated Modules</div>
                <div className="product-trust-item"><CheckCircle size={16} /> Secure Tenant Isolation</div>
                <div className="product-trust-item"><CheckCircle size={16} /> Real-time Sync</div>
              </div>
            </div>
            <div className="product-hero-visual">
              <div className="product-browser-frame">
                <div className="product-browser-bar">
                  <span className="product-browser-dot red" />
                  <span className="product-browser-dot yellow" />
                  <span className="product-browser-dot green" />
                  <span className="product-browser-url">owner.erphub.app/dashboard</span>
                </div>
                <img
                  src="/assets/products/erp-suite/dashboard.png"
                  alt="EduPlatform IMS Dashboard"
                  className="product-hero-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="product-stats-section">
          <div className="product-stats-inner">
            <div className="product-stats-grid">
              {[
                { icon: LogIn, value: '5', label: 'Dedicated Login Portals', accent: '#FFB800' },
                { icon: LayoutDashboard, value: '15+', label: 'Integrated Modules', accent: '#00E5FF' },
                { icon: Shield, value: 'RBAC', label: 'Role-Based Access Control', accent: '#A855F7' },
                { icon: BookMarked, value: 'LMS', label: 'Built-in Learning Portal', accent: '#22C55E' },
              ].map((stat, i) => (
                <div className="product-stat-card" key={i} style={{ '--stat-accent': stat.accent } as React.CSSProperties}>
                  <div className="product-stat-icon-wrap">
                    <stat.icon size={26} className="product-stat-icon" />
                  </div>
                  <span className="product-stat-value">{stat.value}</span>
                  <span className="product-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Login System */}
        <section className="product-login-section" id="multi-login">
          <div className="section-container">
            <div className="product-login-header">
              <h2 className="text-center">One Platform. <span className="gradient-text-dark">Five Smart Portals.</span></h2>
              <p className="section-subtitle text-center">
                Every user gets a tailored experience. Owners see everything. BDEs see their pipeline. Trainers see their batches. Students see their courses. Staff see operations — all securely isolated with role-based permissions.
              </p>
            </div>

            <div className="product-login-showcase">
              <div className="product-login-selector">
                {LOGIN_ROLES.map((role, i) => {
                  const RoleIcon = role.icon;
                  return (
                    <button
                      key={role.id}
                      className={`product-login-role-btn ${activeRole === i ? 'active' : ''}`}
                      onClick={() => setActiveRole(i)}
                      style={{ '--role-color': role.color, '--role-gradient': role.gradient } as React.CSSProperties}
                    >
                      <div className="product-login-role-icon">
                        <RoleIcon size={22} />
                      </div>
                      <div className="product-login-role-text">
                        <strong>{role.title}</strong>
                        <span>{role.role}</span>
                      </div>
                      {activeRole === i && <div className="product-login-role-indicator" />}
                    </button>
                  );
                })}
              </div>

              <div className="product-login-detail">
                <div className="product-login-detail-content">
                  <div className="product-login-portal-badge">
                    <LogIn size={14} />
                    <span>{LOGIN_ROLES[activeRole].portalLabel}</span>
                  </div>
                  <h3>{LOGIN_ROLES[activeRole].title}</h3>
                  <p className="product-login-role-label">{LOGIN_ROLES[activeRole].role}</p>
                  <p className="product-login-desc">{LOGIN_ROLES[activeRole].description}</p>
                  <ul className="product-login-features">
                    {LOGIN_ROLES[activeRole].features.map((f, i) => (
                      <li key={i}><CheckCircle size={15} /> {f}</li>
                    ))}
                  </ul>
                  <div className="product-login-security">
                    <Shield size={16} />
                    <span>Isolated session · Encrypted auth · Permission-scoped data</span>
                  </div>
                </div>
                <div className="product-login-preview">
                  <div className="product-browser-frame product-browser-frame-sm">
                    <div className="product-browser-bar">
                      <span className="product-browser-dot red" />
                      <span className="product-browser-dot yellow" />
                      <span className="product-browser-dot green" />
                      <span className="product-browser-url">{LOGIN_ROLES[activeRole].portalLabel}</span>
                    </div>
                    <img
                      src={LOGIN_ROLES[activeRole].image}
                      alt={`${LOGIN_ROLES[activeRole].title} interface`}
                      key={LOGIN_ROLES[activeRole].id}
                      className="product-login-screenshot"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="product-login-flow">
              <h3 className="text-center">How Multi-Login Works</h3>
              <div className="product-login-flow-grid">
                {[
                  { step: '01', icon: LogIn, title: 'Unified Login Gateway', desc: 'Single sign-in page routes users to their role-specific portal automatically.' },
                  { step: '02', icon: Eye, title: 'Role Detection', desc: 'System identifies user role — Owner, BDE, Trainer, Student, or Staff — on authentication.' },
                  { step: '03', icon: Lock, title: 'Scoped Dashboard', desc: 'Each role sees only permitted modules, data, and actions. No data leakage across roles.' },
                  { step: '04', icon: RefreshCw, title: 'Real-time Sync', desc: 'Changes by one role instantly reflect for others — enrollments, attendance, fees, and leads.' },
                ].map((item, i) => (
                  <div className="product-login-flow-card" key={i}>
                    <span className="product-flow-step">{item.step}</span>
                    <item.icon size={28} className="product-flow-icon" />
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="product-overview-section">
          <div className="section-container">
            <h2 className="text-center">Every Institute Operation. <span className="gradient-text-dark">One Ecosystem.</span></h2>
            <p className="section-subtitle text-center">
              From the first lead enquiry to course completion and job placement — EduPlatform replaces scattered tools with a purpose-built ERP for education businesses.
            </p>
            <div className="product-overview-grid">
              {[
                { icon: Kanban, title: 'CRM & Sales', desc: 'Capture leads, assign BDEs, track conversions, and measure revenue per executive.', color: '#FFB800' },
                { icon: GraduationCap, title: 'Academics', desc: 'Manage courses, batches, trainers, LMS content, and student enrollments seamlessly.', color: '#A855F7' },
                { icon: ClipboardCheck, title: 'Operations', desc: 'Daily attendance via roll call or QR, fee collection, and installment scheduling.', color: '#22C55E' },
                { icon: BarChart3, title: 'Insights', desc: 'Dashboard KPIs, conversion funnels, revenue charts, and operational analytics.', color: '#00E5FF' },
              ].map((item, i) => (
                <div className="product-overview-card" key={i} style={{ '--card-accent': item.color } as React.CSSProperties}>
                  <div className="product-overview-icon-wrap">
                    <item.icon size={28} className="product-overview-icon" />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Features */}
        <section className="product-ai-section" id="ai-features">
          <ProductAnimatedBg variant="section" />
          <div className="section-container">
            <div className="product-ai-header">
              <div className="product-ai-header-badge">
                <Brain size={18} />
                <span>Powered by AI</span>
              </div>
              <h2 className="text-center text-white">
                Intelligent Automation Built Into <span className="gradient-text">Every Workflow</span>
              </h2>
              <p className="section-subtitle text-center text-light">
                EduPlatform doesn&apos;t just store data — it thinks. From scoring leads and detecting at-risk students to evaluating code and forecasting revenue, AI is woven into the platform your team uses every day.
              </p>
            </div>

            <div className="product-ai-highlight">
              <div className="product-ai-highlight-content">
                <Wand2 size={32} className="product-ai-wand" />
                <h3>Why AI in Your Institute ERP?</h3>
                <p>
                  Training institutes lose revenue when leads go cold, students drop out silently, and teams chase the wrong priorities. EduPlatform&apos;s AI layer surfaces what matters — before it becomes a problem.
                </p>
                <ul className="product-ai-highlight-list">
                  <li><CheckCircle size={16} /> Reduce lead response time with smart prioritization</li>
                  <li><CheckCircle size={16} /> Prevent dropouts with early risk alerts</li>
                  <li><CheckCircle size={16} /> Auto-grade coding assignments in LMS</li>
                  <li><CheckCircle size={16} /> Forecast revenue and dues with confidence</li>
                </ul>
              </div>
              <div className="product-ai-stats-row">
                {[
                  { value: '9+', label: 'AI Capabilities' },
                  { value: 'Real-time', label: 'Risk Alerts' },
                  { value: 'Auto', label: 'Lead Scoring' },
                  { value: 'Smart', label: 'BDE Routing' },
                ].map((s, i) => (
                  <div className="product-ai-stat" key={i}>
                    <span className="product-ai-stat-value">{s.value}</span>
                    <span className="product-ai-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-ai-grid">
              {AI_FEATURES.map((feature) => {
                const FeatureIcon = feature.icon;
                return (
                  <article
                    key={feature.id}
                    className="product-ai-card"
                    style={{ '--ai-color': feature.color } as React.CSSProperties}
                  >
                    <div className="product-ai-card-top">
                      <div className="product-ai-card-icon">
                        <FeatureIcon size={22} />
                      </div>
                      <span className="product-ai-module-tag">{feature.module}</span>
                    </div>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <div className="product-section-separator" aria-hidden="true" />

        {/* Module Showcase */}
        <section className="product-modules-section" id="modules">
          <div className="section-container">
            <h2 className="text-center">Explore Every <span className="gradient-text-dark">Module</span></h2>
            <p className="section-subtitle text-center">
              Click a module to preview the live EduPlatform interface — the same screens your team will use daily.
            </p>

            <div className="product-module-tabs">
              {PRODUCT_MODULES.map((mod, i) => (
                <button
                  key={mod.id}
                  className={`product-module-tab ${activeModule === i ? 'active' : ''}`}
                  onClick={() => setActiveModule(i)}
                >
                  {mod.title}
                </button>
              ))}
            </div>

            <div className="product-module-showcase">
              <div className="product-module-info">
                <span className="product-module-index">0{activeModule + 1}</span>
                <h3>{PRODUCT_MODULES[activeModule].title}</h3>
                <p className="product-module-tagline">{PRODUCT_MODULES[activeModule].tagline}</p>
                <p className="product-module-desc">{PRODUCT_MODULES[activeModule].description}</p>
                <ul className="product-module-highlights">
                  {PRODUCT_MODULES[activeModule].highlights.map((h, i) => (
                    <li key={i}><CheckCircle size={16} /> {h}</li>
                  ))}
                </ul>
              </div>
              <div className="product-module-screenshot">
                <div className="product-browser-frame product-browser-frame-sm">
                  <div className="product-browser-bar">
                    <span className="product-browser-dot red" />
                    <span className="product-browser-dot yellow" />
                    <span className="product-browser-dot green" />
                  </div>
                  <img
                    src={PRODUCT_MODULES[activeModule].image}
                    alt={PRODUCT_MODULES[activeModule].alt}
                    key={PRODUCT_MODULES[activeModule].id}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="product-gallery-section">
          <div className="section-container">
            <h2 className="text-center">Built for <span className="gradient-text-dark">Institute Growth</span></h2>
            <p className="section-subtitle text-center">
              Every screen is from the live EduPlatform product — designed, developed, and maintained by ERP Digital Solution.
            </p>

            <div className="product-gallery-grid">
              {PRODUCT_MODULES.map((mod, i) => (
                <article className="product-gallery-card" key={mod.id} style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="product-gallery-image-wrap">
                    <img src={mod.image} alt={mod.alt} loading="lazy" />
                    <div className="product-gallery-overlay">
                      <Eye size={24} />
                    </div>
                  </div>
                  <div className="product-gallery-body">
                    <span className="product-gallery-num">0{i + 1}</span>
                    <h3>{mod.title}</h3>
                    <p>{mod.tagline}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="product-additional-modules">
              <h3 className="text-center">Plus These Modules</h3>
              <div className="product-additional-grid">
                {ADDITIONAL_MODULES.map((mod, i) => (
                  <div className="product-additional-card" key={i}>
                    <div className="product-additional-icon">
                      <mod.icon size={22} />
                    </div>
                    <div>
                      <h4>{mod.title}</h4>
                      <p>{mod.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="product-cta-section">
          <ProductAnimatedBg variant="section" />
          <div className="section-container">
            <div className="product-cta-box">
              <Sparkles size={32} className="product-cta-sparkle" />
              <h2>Ready to Transform Your Institute?</h2>
              <p>See all 5 login portals in action. Get a personalized demo of EduPlatform ERP Suite tailored to your institute's workflows.</p>
              <div className="product-cta-actions">
                <button className="btn btn-primary btn-large product-glow-btn" onClick={openContactModal}>
                  Book a Free Demo <ArrowRight className="btn-arrow" />
                </button>
              </div>
              <div className="product-cta-roles">
                {LOGIN_ROLES.map((role) => (
                  <span key={role.id} className="product-cta-role-chip">{role.title}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top-container">
          <div className="footer-bio">
            <Link to="/" className="logo logo-brand-image">
              <img src={BRAND_LOGO_URL} alt={BRAND_ALT} className="logo-image logo-image-footer" />
            </Link>
            <p>ERP Digital Solution — delivering innovative, secure, and user-friendly digital solutions for educational institutions and enterprises.</p>
          </div>
          <div className="footer-badges">
            <h4>INTEGRATION &amp; PARTNER NETWORK</h4>
            <div className="badge-row">
              <span className="partner-badge">ServiceNow</span>
              <span className="partner-badge">Microsoft Gold</span>
              <span className="partner-badge">LambdaTest</span>
              <span className="partner-badge">Katalon Partner</span>
            </div>
          </div>
        </div>

        <div className="footer-columns-container">
          <div className="footer-col">
            <h4>About Us</h4>
            <ul>
              <li><Link to="/about">Our Company</Link></li>
              <li><Link to="/about">Valued Clients</Link></li>
              <li><Link to="/about">Industry Partners</Link></li>
              <li><Link to="/#case-studies-section">Success Stories</Link></li>
              <li><Link to="/#blog-section">Blogs & Insights</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Products</h4>
            <ul>
              <li><Link to="/products/erp-suite">EduPlatform ERP Suite</Link></li>
              <li><a href="#">CRM Platform</a></li>
              <li><a href="#">HRMS & Payroll</a></li>
              <li><a href="#">Inventory Management</a></li>
              <li><a href="#">Accounting & Finance</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/">Custom Software Dev</Link></li>
              <li><Link to="/">Mobile App Development</Link></li>
              <li><Link to="/">Web App Development</Link></li>
              <li><Link to="/">AI Product Development</Link></li>
              <li><Link to="/">Cloud & DevOps Setup</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>EduPlatform Modules</h4>
            <ul>
              <li><Link to="/products/erp-suite#modules">Leads CRM</Link></li>
              <li><Link to="/products/erp-suite#modules">LMS Ecosystem</Link></li>
              <li><Link to="/products/erp-suite#modules">Attendance</Link></li>
              <li><Link to="/products/erp-suite#ai-features">AI Features</Link></li>
              <li><Link to="/products/erp-suite#multi-login">Multi-Login System</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Reach Out To Us</h4>
            <ul>
              <li><a href="#" className="open-contact-btn" onClick={openContactModal}>Contact Us Today</a></li>
              <li><a href="#">Careers (We&apos;re Hiring!)</a></li>
              <li><a href="#">Global RFP Submissions</a></li>
              <li><a href="#">Partner Program</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-container">
          <div className="subscribe-form-box">
            <h4>Subscribe to our Newsletter</h4>
            <form className="subscribe-form" onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }}>
              <input type="email" placeholder="Enter your business email" required className="subscribe-input" />
              <button type="submit" className="btn btn-accent">Subscribe</button>
            </form>
          </div>

          <div className="social-links-box">
            <h4>Connect Socially</h4>
            <div className="social-links">
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>&copy; 2026 ERP Digital Solution. All Rights Reserved. | www.erphubtechnologies.com</p>
          <div className="legal-links">
            <a href="#">Terms &amp; Conditions</a>
            <span className="divider">|</span>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <div
        className={`modal-overlay ${isContactModalOpen ? 'active' : ''}`}
        id="contactModal"
        onClick={closeContactModal}
      >
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Request a Demo</h3>
            <button className="modal-close-btn" id="closeContactModal" onClick={closeContactModal}>
              <X />
            </button>
          </div>
          <div className="modal-body">
            {!isFormSubmitted ? (
              <>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Tell us about your institute and we&apos;ll schedule a personalized EduPlatform walkthrough.
                </p>
                <form className="contact-form" id="contactForm" onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="clientName">Your Name *</label>
                    <input
                      type="text"
                      id="clientName"
                      placeholder="e.g. Sanjay N"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label htmlFor="clientEmail">Business Email *</label>
                      <input
                        type="email"
                        id="clientEmail"
                        placeholder="e.g. admin@institute.com"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="clientPhone">Phone Number *</label>
                      <input
                        type="tel"
                        id="clientPhone"
                        placeholder="e.g. +91 98765 43210"
                        required
                        value={formData.phone}
                        onChange={handleFormChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="clientSubject">Institute Name *</label>
                    <input
                      type="text"
                      id="clientSubject"
                      placeholder="e.g. IMS Training Academy"
                      required
                      value={formData.subject}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="clientMessage">Requirements *</label>
                    <textarea
                      id="clientMessage"
                      rows={4}
                      placeholder="Tell us about your requirements — number of students, courses, branches..."
                      required
                      value={formData.message}
                      onChange={handleFormChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" id="submitFormBtn">
                    Submit Request
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message active" id="successMessage">
                <div className="success-icon"><CheckCircle /></div>
                <h3>Thank You!</h3>
                <p>Your demo request has been received. Our team will contact you within 24 business hours.</p>
                <button className="btn btn-primary" id="successCloseBtn" onClick={closeContactModal}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
