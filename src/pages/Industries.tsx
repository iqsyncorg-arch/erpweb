import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  PlayCircle,
  X,
  Landmark,
  Umbrella,
  ShoppingCart,
  GraduationCap,
  Activity,
  Zap,
  Truck,
  Factory,
  Info,
  BookOpen,
  Calendar,
  Briefcase,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers2,
  Users2
} from 'lucide-react';

interface IndustryData {
  id: string;
  name: string;
  title: string;
  tagline: string;
  description: string;
  metricValue: string;
  metricLabel: string;
  achievement: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  services: {
    title: string;
    description: string;
  }[];
  color: string;
}

const INDUSTRIES_DATA: Record<string, IndustryData> = {
  'fintech-banking': {
    id: 'fintech-banking',
    name: 'Fintech & Banking',
    title: 'Financial Technology & Digital Banking Solutions',
    tagline: 'High-throughput, secure, and compliant architectures built for institutional-grade finance.',
    description: 'We engineer robust digital banking platforms, algorithmic processing pipelines, and secure ledger systems. Our architectures are built from the ground up to ensure PCI-DSS compliance, minimal transaction latency, and advanced multi-tier security schemes.',
    metricValue: '0.001ms',
    metricLabel: 'Transaction Processing Latency',
    achievement: 'Engineered next-gen neobanking APIs supporting over 15M monthly active users with 99.999% SLA uptime.',
    icon: Landmark,
    color: '#FFB800',
    services: [
      { title: 'Digital Neobanking Platforms', description: 'Comprehensive mobile and web banking suites featuring instant onboarding, multi-currency support, and intuitive account management.' },
      { title: 'High-Throughput Payment Gateways', description: 'Custom transactional rails featuring optimized routing protocols, multi-processor redundancy, and secure tokenization engines.' },
      { title: 'AI Risk & Fraud Mitigation', description: 'Real-time transaction profiling engines executing ML anomaly detection patterns to halt malicious operations instantaneously.' },
      { title: 'Distributed Ledger & Smart Contracts', description: 'Secure, immutable blockchain integrations for trade settlement, supply chain verification, and digital asset management.' }
    ]
  },
  'insurance': {
    id: 'insurance',
    name: 'Insurance',
    title: 'InsurTech Solutions & Intelligent Claims Automation',
    tagline: 'Streamlining underwriting, claims lifecycle, and policy distribution via automated telemetry.',
    description: 'Our InsurTech services modernize legacy insurance systems. We deploy automated risk modeling, optical document processing, and centralized dashboard panels that help insurers lower cost ratios and resolve claims in minutes instead of weeks.',
    metricValue: '60%',
    metricLabel: 'Reduction in Claims Resolution TAT',
    achievement: 'Integrated AI rating engines for leading enterprise underwriters, reducing policy issuance times from 4 days to 3 minutes.',
    icon: Umbrella,
    color: '#00E5FF',
    services: [
      { title: 'Automated Underwriting Systems', description: 'Rule engines utilizing predictive data modeling to generate precise risk profiles and instantly calculate customized premiums.' },
      { title: 'Intelligent Claims Processing', description: 'Cognitive document analysis pipelines parsing damage photos, medical receipts, and accident reports to flag anomalies.' },
      { title: 'Telematics & IoT Policy Rating', description: 'Connecting physical telemetry streams (automotive, health trackers) to dynamically adapt policy parameters and pricing.' },
      { title: 'Omni-channel Customer Portals', description: 'Self-service Web and Mobile applications for quick claims submission, premium payment, and policy modification.' }
    ]
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce',
    title: 'Headless Enterprise E-commerce Platforms',
    tagline: 'High-conversion, ultra-responsive storefronts optimized for massive scale.',
    description: 'We construct highly custom headless commerce architectures, multi-tenant marketplace platforms, and intelligent checkout paths. Our solutions decouple the frontend display layers to maximize page loading speeds and support infinite scalability during traffic spikes.',
    metricValue: '2.4x',
    metricLabel: 'Average Conversion Improvement',
    achievement: 'Successfully managed 50,000 concurrent checkout requests during Black Friday peak campaigns with zero performance degradation.',
    icon: ShoppingCart,
    color: '#4facfe',
    services: [
      { title: 'Headless Commerce Frontends', description: 'Extremely fast storefronts using React/NextJS paired with robust GraphQL APIs to deliver pixel-perfect dynamic browsing.' },
      { title: 'Multi-Vendor Marketplace Engines', description: 'Scale-oriented architectures managing vendor registration, split-payments, automatic shipping calculation, and centralized reviews.' },
      { title: 'Unified Inventory Orchestration', description: 'Real-time synchronization pipelines linking physical warehouses, ERP networks, POS systems, and online channels.' },
      { title: 'AI Personalization & Checkout', description: 'Intelligent cart recommendation engines, single-click checkout configurations, and automatic localization.' }
    ]
  },
  'education': {
    id: 'education',
    name: 'Education',
    title: 'EdTech Platforms & Enterprise LMS Infrastructures',
    tagline: 'Scalable learning environments, virtual classrooms, and comprehensive student administration portals.',
    description: 'We develop secure, multi-tenant Learning Management Systems, university CRM setups, and online classroom hubs. Our digital workspaces prioritize user accessibility, live telemetry analytics, and interactive engagement loops for global learners.',
    metricValue: '5M+',
    metricLabel: 'Active Learners Supported Globally',
    achievement: 'Implemented unified university ERP and student success platform covering 200,000 active students and 15 departments.',
    icon: GraduationCap,
    color: '#a855f7',
    services: [
      { title: 'Next-Generation LMS Ecosystems', description: 'Flexible course management systems supporting SCORM compliance, rich media lectures, adaptive pathways, and digital certification.' },
      { title: 'Virtual Classrooms & Collaboration', description: 'WebRTC video systems with low latency, whiteboards, real-time quizzes, and screen-sharing functions.' },
      { title: 'Student Information Systems (SIS)', description: 'Centralized databases handling admissions, academic grading scales, transcript generation, and student financial records.' },
      { title: 'Predictive Learning Analytics', description: 'AI indicators warning educators about at-risk students by assessing activity patterns, grades, and interaction metrics.' }
    ]
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    title: 'Digital Health Platforms & Clinical Informatics',
    tagline: 'Secure, HIPAA-compliant patient experiences and interoperable medical data pipelines.',
    description: 'We deliver telemedicine applications, patient portals, and healthcare CRM software. We focus deeply on data encryption, HL7/FHIR compliance standards, and connecting EMR/EHR platforms securely without sacrificing usability.',
    metricValue: '100%',
    metricLabel: 'HIPAA & GDPR Data Compliance',
    achievement: 'Designed custom remote patient monitoring systems processing over 120,000 daily diagnostic uploads securely.',
    icon: Activity,
    color: '#22c55e',
    services: [
      { title: 'Secure Telehealth Systems', description: 'Encrypted peer-to-peer video portals featuring appointment scheduling, automated payment billing, and doctor notes panels.' },
      { title: 'Interoperable EHR/EMR Connectors', description: 'Standardized clinical integration pipelines syncing patient data across laboratories, clinics, and hospital databases.' },
      { title: 'Remote Patient Monitoring (RPM)', description: 'Custom mobile portals parsing biometric inputs from medical hardware, alerting physicians about outlier metrics.' },
      { title: 'Clinical Workflow Optimizers', description: 'Staff planning calendars, bed allocation matrices, and drug inventory tracking systems reducing operational overhead.' }
    ]
  }
};

export default function Industries() {
  const { industryId } = useParams<{ industryId: string }>();
  const navigate = useNavigate();

  // Find active industry or fallback to 'fintech-banking'
  const activeKey = industryId && INDUSTRIES_DATA[industryId] ? industryId : 'fintech-banking';
  const activeIndustry = INDUSTRIES_DATA[activeKey];

  // --- States ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenus, setMobileSubmenus] = useState<{ [key: string]: boolean }>({
    services: false,
    industries: false,
    whoWeAre: false,
  });

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // --- Scroll Header listener ---
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    window.scrollTo(0, 0);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeKey]);

  // --- Form & Modal handlers ---
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

  const handleIndustryChange = (key: string) => {
    navigate(`/industries/${key}`);
    setIsMobileMenuOpen(false);
  };

  const ActiveIcon = activeIndustry.icon;

  return (
    <>
      {/* Fullscreen Mega Menu Backdrop Overlay */}
      <div
        className={`mega-menu-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        id="megaMenuBackdrop"
        onClick={() => {
          setIsMobileMenuOpen(false);
          closeContactModal();
        }}
      />

      {/* Header Navigation */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          {/* Corporate Logo Block */}
          <Link to="/" className="logo logo-brand-image" id="logoLink">
            <img src={BRAND_LOGO_HEADER_URL} alt={BRAND_ALT} className="logo-image" />
          </Link>

          {/* Main Navigation Links (Desktop) */}
          <nav className="nav-menu">
            <ul className="nav-list">
              {/* Services Dropdown */}
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
                    </ul>
                    <h3>Quality Engineering</h3>
                    <ul>
                      <li><Link to="/"><ShieldCheck className="menu-icon" /> Software Testing</Link></li>
                      <li><Link to="/"><PlayCircle className="menu-icon" /> Test Automation</Link></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link to="/#tech-stack-section" className="nav-link">Technologies</Link>
              </li>

              {/* Industries Dropdown */}
              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link" style={{ color: 'var(--color-accent-gold)' }}>
                  Industries <ChevronDown className="chevron-icon" />
                </a>
                <div className="mega-menu mega-menu-2col">
                  <div className="mega-col">
                    <h3>Core Industries</h3>
                    <ul>
                      {Object.values(INDUSTRIES_DATA).map((ind) => {
                        const IndIcon = ind.icon;
                        return (
                          <li key={ind.id}>
                            <Link to={`/industries/${ind.id}`} style={{ color: activeKey === ind.id ? 'var(--color-accent-gold)' : 'inherit' }}>
                              <IndIcon className="menu-icon" /> {ind.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Enterprise Sectors</h3>
                    <ul>
                      <li><Link to="/"><Zap className="menu-icon" /> Energy & Utility</Link></li>
                      <li><Link to="/"><Truck className="menu-icon" /> Logistics & SCM</Link></li>
                      <li><Link to="/"><Factory className="menu-icon" /> Manufacturing</Link></li>
                    </ul>
                  </div>
                </div>
              </li>

              {/* Who We Are Dropdown */}
              <li className="nav-item has-dropdown">
                <Link to="/about" className="nav-link">
                  Who We Are <ChevronDown className="chevron-icon" />
                </Link>
                <div className="mega-menu mega-menu-2col">
                  <div className="mega-col">
                    <h3>About Our Company</h3>
                    <ul>
                      <li><Link to="/about"><Info className="menu-icon" /> About Us</Link></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Latest Insights</h3>
                    <ul>
                      <li><Link to="/#blog-section"><BookOpen className="menu-icon" /> Blogs</Link></li>
                      <li><a href="#"><Calendar className="menu-icon" /> Press & Events</a></li>
                      <li><a href="#"><Briefcase className="menu-icon" /> Careers</a></li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="nav-item">
                <Link to="/#case-studies-section" className="nav-link">Success Stories</Link>
              </li>
            </ul>
          </nav>

          {/* CTA Buttons */}
          <div className="header-ctas">
            <button className="btn btn-primary open-contact-btn" onClick={openContactModal}>Contact Us</button>
            <button
              className={`burger-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
              id="burgerMenuBtn"
              aria-label="Toggle Navigation"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      <div className={`mobile-nav-sidebar ${isMobileMenuOpen ? 'active' : ''}`} id="mobileNavSidebar">
        <div className="mobile-nav-header">
          <Link to="/" className="logo logo-brand-image">
            <img src={BRAND_LOGO_HEADER_URL} alt={BRAND_ALT} className="logo-image logo-image-sm" />
          </Link>
          <button className="close-sidebar-btn" id="closeSidebarBtn" onClick={() => setIsMobileMenuOpen(false)}>
            <X />
          </button>
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
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Mobile Engineering</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Product Development</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Cloud Consulting</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>DevOps Consulting</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>AI Development</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>AI As A Service</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>ServiceNow Implementation</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Software Testing</Link></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <Link to="/#tech-stack-section" onClick={() => setIsMobileMenuOpen(false)}>Technologies</Link>
            </li>
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('industries')}>
                Industries
                <ChevronDown style={{ transform: mobileSubmenus.industries ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.industries ? 'active' : 'true'}`}>
                {Object.values(INDUSTRIES_DATA).map((ind) => (
                  <li key={ind.id}>
                    <Link
                      to={`/industries/${ind.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{ color: activeKey === ind.id ? 'var(--color-accent-gold)' : 'inherit', fontWeight: activeKey === ind.id ? 'bold' : 'normal' }}
                    >
                      {ind.name}
                    </Link>
                  </li>
                ))}
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Logistics & SCM</Link></li>
                <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Manufacturing</Link></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('whoWeAre')}>
                Who We Are
                <ChevronDown style={{ transform: mobileSubmenus.whoWeAre ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.whoWeAre ? 'active' : ''}`}>
                <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
                <li><Link to="/#blog-section" onClick={() => setIsMobileMenuOpen(false)}>Blogs</Link></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Careers</a></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <Link to="/#case-studies-section" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</Link>
            </li>
          </ul>
          <button className="btn btn-primary mobile-cta-btn open-contact-btn" onClick={openContactModal}>Contact Us</button>
        </div>
      </div>

      <main>
        {/* Industry Hero Section */}
        <section className="about-hero-section" style={{ paddingTop: '180px', paddingBottom: '80px', background: 'var(--color-dark, #061024)' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', alignItems: 'center' }}>
              <div>
                <span className="section-tag" style={{ color: activeIndustry.color, borderBottomColor: activeIndustry.color }}>Industries We Empower</span>
                <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px', color: '#fff' }}>
                  Custom Software for <br />
                  <span className="gradient-text" style={{ background: `linear-gradient(135deg, #fff 0%, ${activeIndustry.color} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {activeIndustry.name}
                  </span>
                </h1>
                <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '32px' }}>
                  At ERP Digital Solution, we understand that off-the-shelf software solutions often fail to handle core workflow requirements. We create reliable, high-performance, compliant web and mobile ecosystems specialized for your target sector.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={openContactModal} style={{ backgroundColor: activeIndustry.color, color: '#061024' }}>
                    Consult an Industry Expert <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                {/* Visual Placeholder representing Industry Tech */}
                <div style={{
                  borderRadius: '16px',
                  background: 'rgba(13, 27, 62, 0.6)',
                  border: `1px solid rgba(255, 255, 255, 0.08)`,
                  padding: '40px',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative glowing orb colored after the active industry theme */}
                  <div style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: `radial-gradient(circle, ${activeIndustry.color}33 0%, rgba(79, 172, 254, 0) 70%)`,
                    top: '-50px',
                    right: '-50px',
                    zIndex: 0
                  }} />

                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '12px',
                      background: `${activeIndustry.color}1e`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activeIndustry.color,
                      marginBottom: '28px'
                    }}>
                      <ActiveIcon size={32} />
                    </div>

                    <h3 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '16px' }}>{activeIndustry.title}</h3>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
                      {activeIndustry.tagline}
                    </p>

                    <div style={{
                      background: 'rgba(6, 16, 36, 0.5)',
                      borderRadius: '8px',
                      padding: '20px',
                      borderLeft: `4px solid ${activeIndustry.color}`
                    }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', display: 'block', lineHeight: 1 }}>
                        {activeIndustry.metricValue}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px', display: 'block', fontWeight: 500, letterSpacing: '0.5px' }}>
                        {activeIndustry.metricLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Router Navigation Tabs */}
        <section style={{ background: '#0d1b3e', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: '70px', zIndex: 50 }}>
          <div className="section-container" style={{ padding: '20px 0' }}>
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '12px',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              justifyContent: 'center'
            }}>
              {Object.values(INDUSTRIES_DATA).map((ind) => {
                const IndIcon = ind.icon;
                const isActive = activeKey === ind.id;
                return (
                  <button
                    key={ind.id}
                    onClick={() => handleIndustryChange(ind.id)}
                    style={{
                      background: isActive ? ind.color : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#061024' : '#fff',
                      border: '1px solid rgba(255,255,255,0.08)',
                      padding: '12px 24px',
                      borderRadius: '50px',
                      fontSize: '14px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'var(--transition-smooth)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <IndIcon size={16} />
                    {ind.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Main Content & Services */}
        <section style={{ padding: '80px 0', background: 'var(--color-light-sec, #f8fafc)' }}>
          <div className="section-container" style={{ padding: '0 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px', alignItems: 'start' }}>
              
              {/* Left Column: High-level overview & success stories */}
              <div style={{ position: 'sticky', top: '150px' }}>
                <span className="section-tag" style={{ color: activeIndustry.color, borderBottomColor: activeIndustry.color }}>Domain Insight</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '20px', color: 'var(--color-dark)' }}>
                  Core Capabilities
                </h2>
                <p style={{ color: 'var(--color-gray-text)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '30px' }}>
                  {activeIndustry.description}
                </p>

                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '30px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid rgba(0,0,0,0.05)'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle style={{ color: activeIndustry.color }} size={20} />
                    Domain Milestone
                  </h4>
                  <p style={{ color: 'var(--color-gray-text)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                    {activeIndustry.achievement}
                  </p>
                </div>
              </div>

              {/* Right Column: Dynamic services grid */}
              <div>
                <span className="section-tag" style={{ color: activeIndustry.color, borderBottomColor: activeIndustry.color }}>What We Offer</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px', color: 'var(--color-dark)' }}>
                  Tailored Technological Services
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                  {activeIndustry.services.map((service, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#fff',
                        borderRadius: '12px',
                        padding: '32px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid rgba(0,0,0,0.03)',
                        transition: 'transform 0.3s ease, border-color 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = activeIndustry.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.03)';
                      }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '4px',
                        height: '100%',
                        backgroundColor: activeIndustry.color
                      }} />
                      
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '12px' }}>
                        {service.title}
                      </h3>
                      <p style={{ color: 'var(--color-gray-text)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                        {service.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Dynamic Architectural Sandbox Mockup */}
        <section style={{ padding: '80px 0', background: 'var(--color-dark, #061024)', color: '#fff' }}>
          <div className="section-container">
            <span className="section-tag" style={{ color: activeIndustry.color, borderBottomColor: activeIndustry.color }}>Interactive Architecture</span>
            <h2 className="text-center" style={{ color: '#fff', fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>
              High-Availability Blueprint
            </h2>
            <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 60px', color: '#cbd5e1', lineHeight: 1.6 }}>
              Visualizing the underlying microservices layer configured by ERP Digital Solution for {activeIndustry.name} clients.
            </p>

            <div style={{
              background: '#0d1b3e',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', position: 'relative' }}>
                
                {/* Node 1 */}
                <div style={{
                  background: 'rgba(6, 16, 36, 0.6)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: activeIndustry.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Users2 size={24} /></div>
                  <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>Client Interfaces</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Mobile Apps, Headless Storefronts, Enterprise Portals</p>
                </div>

                {/* Node 2 */}
                <div style={{
                  background: 'rgba(6, 16, 36, 0.6)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: `1px solid ${activeIndustry.color}55`,
                  textAlign: 'center'
                }}>
                  <div style={{ color: activeIndustry.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Shield size={24} /></div>
                  <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>API Gateway & WAF</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Rate limiting, JWT authentication, request routing</p>
                </div>

                {/* Node 3 */}
                <div style={{
                  background: 'rgba(6, 16, 36, 0.6)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: activeIndustry.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><Layers2 size={24} /></div>
                  <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>Domain Microservices</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Decoupled business logic engines on container clusters</p>
                </div>

                {/* Node 4 */}
                <div style={{
                  background: 'rgba(6, 16, 36, 0.6)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  textAlign: 'center'
                }}>
                  <div style={{ color: activeIndustry.color, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><TrendingUp size={24} /></div>
                  <h4 style={{ color: '#fff', marginBottom: '8px', fontWeight: 700 }}>Data Lake & Cache</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Multi-zone replicas, key-value layers, secure audits</p>
                </div>

              </div>

              <div style={{
                textAlign: 'center',
                marginTop: '40px',
                paddingTop: '30px',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}>
                <button className="btn btn-primary" onClick={openContactModal} style={{ backgroundColor: activeIndustry.color, color: '#061024' }}>
                  Request System Architecture Blueprint
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Global Consultation Section */}
        <section style={{ padding: '80px 0', background: '#0d1b3e', color: '#fff' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
              <div>
                <span className="section-tag" style={{ color: activeIndustry.color, borderBottomColor: activeIndustry.color }}>Get Started</span>
                <h2 style={{ color: '#fff', fontSize: '2.4rem', fontWeight: 800, marginBottom: '16px' }}>
                  Ready to evolve your {activeIndustry.name} digital stack?
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Contact our software architects today for a complete technological feasibility analysis and customized solutions blueprint.
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', flexWrap: 'wrap' }}>
                <button className="btn btn-primary btn-large" onClick={openContactModal} style={{ backgroundColor: activeIndustry.color, color: '#061024' }}>
                  Initiate Technical Consultation
                </button>
                <Link to="/about" className="btn btn-secondary btn-large">
                  Learn About Our SLAs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-top-container">
          <div className="footer-bio">
            <Link to="/" className="logo logo-brand-image">
              <img src={BRAND_LOGO_URL} alt={BRAND_ALT} className="logo-image logo-image-footer" />
            </Link>
            <p>ERP Digital Solution designs, manages, and scales high-performance enterprise platforms and dedicated product lifecycles across major industrial tech corridors.</p>
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
              <li><Link to="/about">Events & Meetups</Link></li>
              <li><Link to="/about">Awards & Recognition</Link></li>
              <li><Link to="/#case-studies-section">Success Stories</Link></li>
              <li><Link to="/#blog-section">Blogs & Insights</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/">Custom Software Dev</Link></li>
              <li><Link to="/">Mobile App Development</Link></li>
              <li><Link to="/">Web App Development</Link></li>
              <li><Link to="/">Software Testing & QA</Link></li>
              <li><Link to="/">Application Modernization</Link></li>
              <li><Link to="/">AI Product Development</Link></li>
              <li><Link to="/">Cloud & DevOps Setup</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Featured Portfolios</h4>
            <ul>
              <li><Link to="/">Edelweiss Asset Platform</Link></li>
              <li><Link to="/">Adani Utilities Cloud</Link></li>
              <li><Link to="/">Cover-More Claim App</Link></li>
              <li><Link to="/">PTTEP Telecom Pipeline</Link></li>
              <li><Link to="/">KFC Digital Checkout</Link></li>
              <li><Link to="/">IndiGo Crew Roster system</Link></li>
              <li><Link to="/">TAI Testing Services</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>ServiceNow Solutions</h4>
            <ul>
              <li><Link to="/">IT Service Management</Link></li>
              <li><Link to="/">IT Asset Management</Link></li>
              <li><Link to="/">Strategic Portfolio Mgmt</Link></li>
              <li><Link to="/">Managed Platform Services</Link></li>
              <li><Link to="/">IT Operations Management</Link></li>
              <li><Link to="/">Organizational Change</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Reach Out To Us</h4>
            <ul>
              <li><a href="#" className="open-contact-btn" onClick={openContactModal}>Contact Us Today</a></li>
              <li><a href="#">Careers (We're Hiring!)</a></li>
              <li><a href="#">Global RFP Submissions</a></li>
              <li><a href="#">Partner Program</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-container">
          <div className="subscribe-form-box">
            <h4>Subscribe to our Corporate Newsletter</h4>
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

      {/* Floating Action Widgets */}
      <a href="https://wa.me/919344096860" target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.86.002-2.638-1.025-5.116-2.893-6.986C16.572 1.838 14.09 1.81 11.45 1.81c-5.438 0-9.861 4.417-9.863 9.861-.001 1.765.485 3.489 1.411 4.972l-.988 3.6 3.69-.968zm11.597-7.852c-.3-.15-1.77-.874-2.046-.975-.276-.102-.477-.152-.676.15-.199.3-.772.975-.947 1.176-.176.201-.351.226-.651.075-1.029-.514-1.7-1.094-2.38-2.25-.19-.324.19-.301.543-.997.075-.15.038-.281-.019-.382-.057-.101-.477-1.15-.654-1.576-.172-.416-.362-.359-.496-.366-.128-.006-.275-.008-.423-.008-.148 0-.389.055-.593.281-.204.226-.777.76-0.777 1.854 0 1.093.796 2.148.907 2.3.111.15 1.564 2.39 3.79 3.35 1.814.78 2.2.62 2.97.55.77-.07 1.77-.72 2.02-1.38.25-.66.25-1.23.17-1.35-.07-.12-.27-.2-.57-.35z" />
        </svg>
      </a>



      {/* Modal Contact Form Popup */}
      <div className={`modal-overlay ${isContactModalOpen ? 'active' : ''}`} id="contactModal">
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Request Corporate Consultation</h3>
            <button className="modal-close-btn" id="closeContactModal" onClick={closeContactModal}>
              <X />
            </button>
          </div>
          <div className="modal-body">
            {!isFormSubmitted ? (
              <form className="contact-form" id="contactForm" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="clientName">Your Name *</label>
                  <input
                    type="text"
                    id="clientName"
                    placeholder="e.g. John Doe"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="clientEmail">Corporate Email *</label>
                    <input
                      type="email"
                      id="clientEmail"
                      placeholder="e.g. john@company.com"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="clientPhone">Contact Number *</label>
                    <input
                      type="tel"
                      id="clientPhone"
                      placeholder="e.g. +1 555-0199"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="clientSubject">Project Domain Subject *</label>
                  <input
                    type="text"
                    id="clientSubject"
                    placeholder="e.g. Enterprise Architecture Modernization Blueprint"
                    required
                    value={formData.subject}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientMessage">Functional Requirements Summary *</label>
                  <textarea
                    id="clientMessage"
                    rows={4}
                    placeholder="Please outline your target timeline, infrastructure bottlenecks, or solution criteria..."
                    required
                    value={formData.message}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-full" id="submitFormBtn">Submit Discovery Briefing</button>
              </form>
            ) : (
              <div className="success-message active" id="successMessage">
                <div className="success-icon"><CheckCircle /></div>
                <h3>Briefing Received</h3>
                <p>Your institutional discovery requirements have been securely recorded. An executive architecture representative from ERP Digital Solution will connect with your management channel within 24 business hours.</p>
                <button className="btn btn-primary" id="successCloseBtn" onClick={closeContactModal}>Dismiss Window</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
