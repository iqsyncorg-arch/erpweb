import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AboutUs from './pages/AboutUs';
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
  ArrowRight,
  ChevronRight,
  Code2,
  RefreshCw,
  Bug,
  BarChart3,
  CloudLightning,
  Landmark,
  Umbrella,
  ShoppingCart,
  GraduationCap,
  Activity,
  Zap,
  Truck,
  Factory,
  Info,
  User,
  BookOpen,
  Calendar,
  Briefcase,
  Quote,
  Star,
  MapPin,
  Phone,
  Globe,
  CheckCircle,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

export default function App() {
  // --- States ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenus, setMobileSubmenus] = useState<{ [key: string]: boolean }>({
    services: false,
    industries: false,
    whoWeAre: false,
  });

  const [activeTab, setActiveTab] = useState('frontend');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(1); // Index 1 is active by default
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // --- Refs ---
  const trackRef = useRef<HTMLDivElement>(null);

  // --- Scroll Header listener ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Slider track translation logic on dot change / window resize ---
  const handleTestimonialChange = (index: number) => {
    setActiveTestimonialIndex(index);
    if (trackRef.current) {
      const targetCard = trackRef.current.children[index] as HTMLElement;
      if (targetCard) {
        trackRef.current.style.transform = `translateX(-${targetCard.offsetLeft}px)`;
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (trackRef.current) {
        const targetCard = trackRef.current.children[activeTestimonialIndex] as HTMLElement;
        if (targetCard) {
          trackRef.current.style.transform = `translateX(-${targetCard.offsetLeft}px)`;
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTestimonialIndex]);

  // --- Form & Modal handlers ---
  const openContactModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsContactModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    document.body.style.overflow = '';
    // Reset state after CSS transition completes
    setTimeout(() => {
      setIsFormSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 300);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    // Map html input id to form state key
    const stateKey = id.replace('client', '').toLowerCase();
    setFormData(prev => ({
      ...prev,
      [stateKey]: value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
  };

  const toggleMobileSubmenu = (key: string) => {
    setMobileSubmenus(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleFaq = (index: number) => {
    if (activeFaqIndex === index) {
      setActiveFaqIndex(null);
    } else {
      setActiveFaqIndex(index);
    }
  };

  return (
    <Routes>
      <Route path="/about" element={<AboutUs />} />
      <Route path="/" element={<HomeContent
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        mobileSubmenus={mobileSubmenus}
        toggleMobileSubmenu={toggleMobileSubmenu}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeFaqIndex={activeFaqIndex}
        toggleFaq={toggleFaq}
        activeTestimonialIndex={activeTestimonialIndex}
        handleTestimonialChange={handleTestimonialChange}
        trackRef={trackRef}
        openContactModal={openContactModal}
        closeContactModal={closeContactModal}
        isContactModalOpen={isContactModalOpen}
        formData={formData}
        handleFormChange={handleFormChange}
        handleFormSubmit={handleFormSubmit}
        isFormSubmitted={isFormSubmitted}
      />} />
    </Routes>
  );
}

// ─── Home page wrapper component ─────────────────────────────────────────────
interface HomeContentProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (v: boolean) => void;
  mobileSubmenus: { [key: string]: boolean };
  toggleMobileSubmenu: (key: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeFaqIndex: number | null;
  toggleFaq: (idx: number) => void;
  activeTestimonialIndex: number;
  handleTestimonialChange: (idx: number) => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
  openContactModal: (e: React.MouseEvent) => void;
  closeContactModal: () => void;
  isContactModalOpen: boolean;
  formData: { name: string; email: string; phone: string; subject: string; message: string };
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  isFormSubmitted: boolean;
}

function HomeContent({
  isScrolled, isMobileMenuOpen, setIsMobileMenuOpen,
  mobileSubmenus, toggleMobileSubmenu,
  activeTab, setActiveTab,
  activeFaqIndex, toggleFaq,
  activeTestimonialIndex, handleTestimonialChange, trackRef,
  openContactModal, closeContactModal,
  isContactModalOpen, formData, handleFormChange, handleFormSubmit, isFormSubmitted,
}: HomeContentProps) {
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
          {/* Logo */}
          <a href="#" className="logo" id="logoLink">
            <span className="logo-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </span>
            <span className="logo-text">ERP<span> HUB</span></span>
          </a>

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
                      <li><a href="#"><Cpu className="menu-icon" /> Software Engineering</a></li>
                      <li><a href="#"><Smartphone className="menu-icon" /> Mobile Engineering</a></li>
                      <li><a href="#"><Layers className="menu-icon" /> Product Development</a></li>
                    </ul>
                    <h3>Cloud & DevOps</h3>
                    <ul>
                      <li><a href="#"><Cloud className="menu-icon" /> Cloud Consulting</a></li>
                      <li><a href="#"><InfinityIcon className="menu-icon" /> DevOps Consulting</a></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Artificial Intelligence</h3>
                    <ul>
                      <li><a href="#"><Bot className="menu-icon" /> AI Development</a></li>
                      <li><a href="#"><Brain className="menu-icon" /> AI As A Service</a></li>
                      <li><a href="#"><Network className="menu-icon" /> ML Development</a></li>
                    </ul>
                    <h3>Strategy & Design</h3>
                    <ul>
                      <li><a href="#"><Compass className="menu-icon" /> Product Strategy</a></li>
                      <li><a href="#"><Palette className="menu-icon" /> Experience Design</a></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Systems Implementation</h3>
                    <ul>
                      <li><a href="#"><Workflow className="menu-icon" /> ServiceNow Implementation</a></li>
                      <li><a href="#"><Terminal className="menu-icon" /> Microsoft Enterprise Dev</a></li>
                    </ul>
                    <h3>Quality Engineering</h3>
                    <ul>
                      <li><a href="#"><ShieldCheck className="menu-icon" /> Software Testing</a></li>
                      <li><a href="#"><PlayCircle className="menu-icon" /> Test Automation</a></li>
                    </ul>
                  </div>
                </div>
              </li>

              {/* Technologies Link */}
              <li className="nav-item">
                <a href="#tech-stack-section" className="nav-link">Technologies</a>
              </li>

              {/* Industries Dropdown */}
              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link">Industries <ChevronDown className="chevron-icon" /></a>
                <div className="mega-menu mega-menu-2col">
                  <div className="mega-col">
                    <h3>Core Industries</h3>
                    <ul>
                      <li><a href="#"><Landmark className="menu-icon" /> Fintech & Banking</a></li>
                      <li><a href="#"><Umbrella className="menu-icon" /> Insurance</a></li>
                      <li><a href="#"><ShoppingCart className="menu-icon" /> E-commerce</a></li>
                      <li><a href="#"><GraduationCap className="menu-icon" /> Education</a></li>
                      <li><a href="#"><Activity className="menu-icon" /> Healthcare</a></li>
                    </ul>
                  </div>
                  <div className="mega-col">
                    <h3>Enterprise Sectors</h3>
                    <ul>
                      <li><a href="#"><Zap className="menu-icon" /> Energy & Utility</a></li>
                      <li><a href="#"><Truck className="menu-icon" /> Logistics & SCM</a></li>
                      <li><a href="#"><Factory className="menu-icon" /> Manufacturing</a></li>
                    </ul>
                  </div>
                </div>
              </li>

              {/* Who We Are Dropdown */}
              <li className="nav-item has-dropdown">
                <a href="#who-we-are-section" className="nav-link">Who We Are <ChevronDown className="chevron-icon" /></a>
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
                      <li><a href="#blog-section"><BookOpen className="menu-icon" /> Blogs</a></li>
                      <li><a href="#"><Calendar className="menu-icon" /> Press & Events</a></li>
                      <li><a href="#"><Briefcase className="menu-icon" /> Careers</a></li>
                    </ul>
                  </div>
                </div>
              </li>

              {/* Success Stories Link */}
              <li className="nav-item">
                <a href="#case-studies-section" className="nav-link">Success Stories</a>
              </li>
            </ul>
          </nav>

          {/* CTA Buttons */}
          <div className="header-ctas">
            <button className="btn btn-primary open-contact-btn" onClick={openContactModal}>Contact Us</button>
            {/* Mobile Menu Toggle Burger */}
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
          <a href="#" className="logo">
            <span className="logo-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </span>
            <span className="logo-text">ERP<span> HUB</span></span>
          </a>
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
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Software Engineering</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Mobile Engineering</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Product Development</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Cloud Consulting</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>DevOps Consulting</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>AI Development</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>AI As A Service</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>ServiceNow Implementation</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Software Testing</a></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <a href="#tech-stack-section" onClick={() => setIsMobileMenuOpen(false)}>Technologies</a>
            </li>
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('industries')}>
                Industries
                <ChevronDown style={{ transform: mobileSubmenus.industries ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.industries ? 'active' : ''}`}>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Fintech & Banking</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Insurance</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>E-commerce</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Education</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Healthcare</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Logistics & SCM</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Manufacturing</a></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('whoWeAre')}>
                Who We Are
                <ChevronDown style={{ transform: mobileSubmenus.whoWeAre ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.whoWeAre ? 'active' : ''}`}>
                <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link></li>
                <li><a href="#blog-section" onClick={() => setIsMobileMenuOpen(false)}>Blogs</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Careers</a></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <a href="#case-studies-section" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</a>
            </li>
          </ul>
          <button className="btn btn-primary mobile-cta-btn open-contact-btn" onClick={openContactModal}>Contact Us</button>
        </div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <span className="hero-tag">ENTERPRISE TECH COMPANY</span>
              <h1 className="hero-title">
                Empowering Businesses with <span className="gradient-text">Custom Digital Solutions</span>
              </h1>
              <p className="hero-subtitle">
                ERP HUB Technologies delivers innovative web, mobile, and software development solutions for startups, enterprises, and growing businesses across industries.
              </p>
              <div className="hero-cta-pills">
                <a href="#" className="pill-link"><span className="pulse-dot"></span> AI Solutions</a>
                <a href="#" className="pill-link"><span className="pulse-dot"></span> Data Engineering</a>
                <a href="#" className="pill-link"><span className="pulse-dot"></span> Cloud Infrastructure</a>
              </div>
              <div className="hero-actions">
                <button className="btn btn-primary btn-large open-contact-btn" onClick={openContactModal}>Get Started Now</button>
                <a href="#case-studies-section" className="btn btn-secondary btn-large">View Success Stories</a>
              </div>
            </div>
            <div className="hero-graphics">
              <div className="graphics-wrapper">
                <img src="/hero_illustration.png" alt="AI-driven Software Architecture Illustration" className="hero-img" />
                <div className="glowing-orb"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Growth & Partners Section */}
        <section className="growth-section">
          <div className="section-container">
            <div className="growth-content">
              <div className="growth-text">
                <h2>Transform Your Business with Scalable Digital Solutions</h2>
                <p className="section-subtitle">Helping startups, enterprises, and growing businesses build reliable digital products.</p>
                <p className="body-desc">
                  ERP HUB Technologies is a technology-driven company specializing in web development, mobile application development, and customized software solutions. Our goal is to build reliable digital products that not only solve current business challenges but also support long-term growth and scalability.
                </p>
                <button className="btn btn-accent open-contact-btn" onClick={openContactModal}>
                  Book a 30-min Product Discovery Call <ArrowRight className="btn-arrow" />
                </button>
              </div>
              <div className="partners-grid-container">
                <h3>TRUSTED BY INDUSTRY LEADERS</h3>
                <div className="partners-logo-grid">
                  <div className="partner-logo-card"><span>TAI Services</span></div>
                  <div className="partner-logo-card"><span>Trepp</span></div>
                  <div className="partner-logo-card"><span>peoplestrong</span></div>
                  <div className="partner-logo-card"><span>KFC</span></div>
                  <div className="partner-logo-card"><span>adani</span></div>
                  <div className="partner-logo-card"><span>GlobalBees</span></div>
                  <div className="partner-logo-card"><span>IndiGo</span></div>
                  <div className="partner-logo-card"><span>Cover-More</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Case Studies Section */}
        <section className="case-studies-section" id="case-studies-section">
          <div className="section-container">
            <span className="section-tag text-center">SUCCESS STORIES</span>
            <h2 className="text-center">Featured Case Studies</h2>
            <p className="section-subtitle text-center">Real-world impact delivered through custom tech engineering.</p>

            <div className="case-study-card">
              <div className="case-study-details">
                <span className="case-tag">INDUSTRIAL LOGISTICS & TESTING</span>
                <h3>2X Improved Digital Presence for USA’s Prominent Industrial Testing & Inspection Company</h3>
                <p>We engineered a highly robust Cloud dashboard with deep analytics and real-time field data processing. The solution modernized their entire field inspector workflow, reducing reporting turnaround times.</p>
                <div className="stats-row">
                  <div className="stat-box">
                    <span className="stat-number">40%</span>
                    <span className="stat-label">Improved Efficiency</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">60%</span>
                    <span className="stat-label">Increased App Speed</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-number">80%</span>
                    <span className="stat-label">Reduced Onboarding TAT</span>
                  </div>
                </div>
                <button className="btn btn-secondary open-contact-btn" onClick={openContactModal}>
                  Read Case Study <ArrowRight className="btn-arrow" />
                </button>
              </div>
              <div className="case-study-visual">
                <div className="dashboard-mockup">
                  <div className="mockup-header">
                    <span className="circle red"></span>
                    <span className="circle yellow"></span>
                    <span className="circle green"></span>
                    <span className="mockup-title">ERPdigital Dashboard</span>
                  </div>
                  <div className="mockup-body">
                    <div className="mockup-sidebar">
                      <div className="line short"></div>
                      <div className="line"></div>
                      <div className="line"></div>
                      <div className="line short"></div>
                    </div>
                    <div className="mockup-content">
                      <div className="content-row">
                        <div className="content-box"></div>
                        <div className="content-box"></div>
                        <div className="content-box"></div>
                      </div>
                      <div className="chart-container">
                        <svg viewBox="0 0 300 120" className="chart-svg">
                          <path d="M 0 100 Q 50 40 100 80 T 200 20 T 300 60" fill="none" stroke="#FFB800" strokeWidth="4"></path>
                          <path d="M 0 120 Q 50 60 100 90 T 200 40 T 300 80" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="4"></path>
                          <circle cx="100" cy="80" r="5" fill="#FFB800"></circle>
                          <circle cx="200" cy="20" r="5" fill="#00E5FF"></circle>
                        </svg>
                      </div>
                      <div className="content-row">
                        <div className="line long"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="services-section">
          <div className="section-container">
            <span className="section-tag text-center">OUR SERVICES</span>
            <h2 className="text-center">Powering Innovation with AI-Driven Solutions Built for Speed and Precision</h2>
            <p className="section-subtitle text-center">We help clients transform visionary ideas into reality by providing future-ready software solutions, boosting client growth with impeccable software solutions and services. Here are some of our offerings:</p>

            <div className="services-grid">
              {/* Card 1 */}
              <div className="service-card">
                <div className="service-icon"><Code2 /></div>
                <h3>Custom Software Development</h3>
                <p>We are a reputed software development company that provides creative, tailored solutions for enterprises.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 2 */}
              <div className="service-card">
                <div className="service-icon"><Smartphone /></div>
                <h3>Application Development</h3>
                <p>Powered by clients' unique needs, we customize and deliver premium, high-performance mobile and web apps.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 3 */}
              <div className="service-card">
                <div className="service-icon"><Brain /></div>
                <h3>AI as a Service</h3>
                <p>Unlock doors to success with AI. We provide cutting-edge AI solutions to clients that transform business efficiency.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 4 */}
              <div className="service-card">
                <div className="service-icon"><RefreshCw /></div>
                <h3>Application Modernization</h3>
                <p>Modernize legacy systems built for any platform with our dedicated software refactoring and optimization services.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 5 */}
              <div className="service-card">
                <div className="service-icon"><Workflow /></div>
                <h3>ServiceNow Implementation</h3>
                <p>We help organizations maximize the full power of ServiceNow platform with integrations, configuration, and workflows.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 6 */}
              <div className="service-card">
                <div className="service-icon"><Bug /></div>
                <h3>Software Testing Services</h3>
                <p>Access modern test environments, automation frameworks, and practices to debug, secure, and validate applications.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 7 */}
              <div className="service-card">
                <div className="service-icon"><InfinityIcon /></div>
                <h3>DevOps Implementation</h3>
                <p>Streamline software deployment pipelines using modern CI/CD automation, monitoring, and cloud-native practices.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 8 */}
              <div className="service-card">
                <div className="service-icon"><BarChart3 /></div>
                <h3>Data Science & BI</h3>
                <p>Extract highly actionable insights using predictive model development, analytics dashboards, and data governance.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
              {/* Card 9 */}
              <div className="service-card">
                <div className="service-icon"><CloudLightning /></div>
                <h3>Cloud Deployment</h3>
                <p>Design, deploy, configure, and scale robust containerized microservices architectures on AWS, Azure, and GCP.</p>
                <a href="#" className="service-link open-contact-btn" onClick={openContactModal}>Learn More <ChevronRight /></a>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack Section */}
        <section className="tech-stack-section" id="tech-stack-section">
          <div className="section-container">

            <h2 className="text-center">Our Technology Stack</h2>
            <p className="section-subtitle text-center">We build on reliable, scalable, and cutting-edge software foundations to power your applications.</p>

            <div className="tech-tabs-container">
              {/* Sidebar Navigation */}
              <div className="tech-sidebar">
                <button
                  className={`tech-tab-btn ${activeTab === 'frontend' ? 'active' : ''}`}
                  onClick={() => setActiveTab('frontend')}
                >
                  Frontend Engineering <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'backend' ? 'active' : ''}`}
                  onClick={() => setActiveTab('backend')}
                >
                  Backend Engineering <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'genai' ? 'active' : ''}`}
                  onClick={() => setActiveTab('genai')}
                >
                  Generative AI <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'databases' ? 'active' : ''}`}
                  onClick={() => setActiveTab('databases')}
                >
                  Databases & Caching <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'quality' ? 'active' : ''}`}
                  onClick={() => setActiveTab('quality')}
                >
                  Quality Engineering <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'mobile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mobile')}
                >
                  Mobile Engineering <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'cloud' ? 'active' : ''}`}
                  onClick={() => setActiveTab('cloud')}
                >
                  Cloud & DevOps <ChevronRight className="arrow" />
                </button>
                <button
                  className={`tech-tab-btn ${activeTab === 'data' ? 'active' : ''}`}
                  onClick={() => setActiveTab('data')}
                >
                  Data Engineering <ChevronRight className="arrow" />
                </button>
              </div>

              {/* Dynamic Content Panel */}
              <div className="tech-content-panel">
                {activeTab === 'frontend' && (
                  <div className="tech-tab-content active">
                    <h3>Frontend Engineering</h3>
                    <p>We build highly interactive, responsive, and performance-tuned user interfaces utilizing state-of-the-art UI architectures and frameworks.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">React.js</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Vue.js</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Angular</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Next.js</span></div>
                      <div className="tech-logo-item"><span className="logo-box">TypeScript</span></div>
                      <div className="tech-logo-item"><span className="logo-box">HTML5/CSS3</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Tailwind CSS</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Svelte</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'backend' && (
                  <div className="tech-tab-content active">
                    <h3>Backend Engineering</h3>
                    <p>We develop microservices-driven, scalable back-end infrastructure, guaranteeing robust security, high performance, and seamless growth for your applications.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">Node.js</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Python</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Java / Spring</span></div>
                      <div className="tech-logo-item"><span className="logo-box">.NET Core</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Go (Golang)</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Django</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Express.js</span></div>
                      <div className="tech-logo-item"><span className="logo-box">GraphQL</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'genai' && (
                  <div className="tech-tab-content active">
                    <h3>Generative AI</h3>
                    <p>We leverage Generative AI and LLMs to automate business operations, power intelligent agents, and lead in custom cognitive workflows.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">OpenAI GPT</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Gemini AI</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Claude LLM</span></div>
                      <div className="tech-logo-item"><span className="logo-box">DeepSeek</span></div>
                      <div className="tech-logo-item"><span className="logo-box">LangChain</span></div>
                      <div className="tech-logo-item"><span className="logo-box">LlamaIndex</span></div>
                      <div className="tech-logo-item"><span className="logo-box">HuggingFace</span></div>
                      <div className="tech-logo-item"><span className="logo-box">CrewAI</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'databases' && (
                  <div className="tech-tab-content active">
                    <h3>Databases & Caching</h3>
                    <p>We implement optimal storage solutions to develop secure, high-performance, and scalable applications customized to your requirements.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">PostgreSQL</span></div>
                      <div className="tech-logo-item"><span className="logo-box">MySQL</span></div>
                      <div className="tech-logo-item"><span className="logo-box">MongoDB</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Redis</span></div>
                      <div className="tech-logo-item"><span className="logo-box">DynamoDB</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Elasticsearch</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Cassandra</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Firebase</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'quality' && (
                  <div className="tech-tab-content active">
                    <h3>Quality Engineering & Automation</h3>
                    <p>We deliver bug-free releases through comprehensive end-to-end automation frameworks, unit testing, load testing, and security scanning pipelines.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">Selenium</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Playwright</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Cypress</span></div>
                      <div className="tech-logo-item"><span className="logo-box">JMeter</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Appium</span></div>
                      <div className="tech-logo-item"><span className="logo-box">JUnit / PyTest</span></div>
                      <div className="tech-logo-item"><span className="logo-box">SonarQube</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'mobile' && (
                  <div className="tech-tab-content active">
                    <h3>Mobile Engineering</h3>
                    <p>We craft high-performance cross-platform and native mobile software to reach clients anywhere, anytime.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">Flutter</span></div>
                      <div className="tech-logo-item"><span className="logo-box">React Native</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Swift (iOS)</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Kotlin (Android)</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Dart</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Ionic</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'cloud' && (
                  <div className="tech-tab-content active">
                    <h3>Cloud Infrastructure & DevOps</h3>
                    <p>We design high-availability system topologies, optimize cloud budgets, and set up continuous orchestration pipelines.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">AWS</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Microsoft Azure</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Google Cloud</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Docker</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Kubernetes</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Terraform</span></div>
                      <div className="tech-logo-item"><span className="logo-box">GitHub Actions</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Jenkins</span></div>
                    </div>
                  </div>
                )}

                {activeTab === 'data' && (
                  <div className="tech-tab-content active">
                    <h3>Data Engineering</h3>
                    <p>We model, parse, ingest, and process massive transactional and analytical datasets to feed corporate business intelligence models.</p>
                    <div className="tech-logos-grid">
                      <div className="tech-logo-item"><span className="logo-box">Apache Spark</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Hadoop</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Snowflake</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Apache Kafka</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Databricks</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Power BI</span></div>
                      <div className="tech-logo-item"><span className="logo-box">Tableau</span></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Industries We Serve Section */}
        <section className="industries-section">
          <div className="section-container">
            <span className="section-tag text-center light">VERTICAL SOLUTIONS</span>
            <h2 className="text-center text-white">Revolutionizing Industries With Tech That Breaks Barriers</h2>
            <p className="section-subtitle text-center text-light">Over the years, ERP HUB Technologies has worked on developing robust solutions for complex business problems across healthcare, education, fintech, and more.</p>

            <div className="industries-grid">
              {/* Industry 1 */}
              <div className="industry-card">
                <div className="industry-card-icon"><Landmark /></div>
                <h3>Banking & Finance</h3>
                <p>We empower fintech companies and commercial institutions with secure digital banking, transactional microservices, and compliance tech.</p>
              </div>
              {/* Industry 2 */}
              <div className="industry-card">
                <div className="industry-card-icon"><Umbrella /></div>
                <h3>Insurance</h3>
                <p>We offer user-centric digital claim portals, quote calculators, and automated risk scoring systems to enhance consumer experience.</p>
              </div>
              {/* Industry 3 */}
              <div className="industry-card">
                <div className="industry-card-icon"><ShoppingCart /></div>
                <h3>Retail & E-commerce</h3>
                <p>We help global retailers develop omnichannel solutions, headless checkout microservices, and AI product recommenders.</p>
              </div>
              {/* Industry 4 */}
              <div className="industry-card">
                <div className="industry-card-icon"><GraduationCap /></div>
                <h3>Education</h3>
                <p>We help EdTech companies deliver virtual classroom solutions, collaborative dashboards, CRM setups, and customized LMS portals.</p>
              </div>
              {/* Industry 5 */}
              <div className="industry-card">
                <div className="industry-card-icon"><Activity /></div>
                <h3>Healthcare</h3>
                <p>We offer unparalleled HIPAA-compliant EHR interfaces, medical telemedicine modules, and clinical scheduling algorithms.</p>
              </div>
              {/* Industry 6 */}
              <div className="industry-card">
                <div className="industry-card-icon"><Zap /></div>
                <h3>Energy & Utilities</h3>
                <p>We empower utility providers with IoT smart meter ingestion systems, operational telemetry, and preventive asset maintenance tools.</p>
              </div>
              {/* Industry 7 */}
              <div className="industry-card">
                <div className="industry-card-icon"><Truck /></div>
                <h3>Logistics & SCM</h3>
                <p>We optimize supply chain systems with fleet geofencing trackers, warehouse stock routing, and inventory forecast algorithms.</p>
              </div>
              {/* Industry 8 */}
              <div className="industry-card">
                <div className="industry-card-icon"><Factory /></div>
                <h3>Manufacturing</h3>
                <p>We streamline raw material pipeline planning, MRP software setups, and equipment uptime diagnostics with industrial IoT data.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section">
          <div className="section-container">
            <span className="section-tag text-center">CLIENT CORNER</span>
            <h2 className="text-center">What Our Clients Say About Their Transformative Journeys</h2>
            <p className="section-subtitle text-center">We've served more than 300 clients globally in the last 8 years and retained 95% of them.</p>

            <div className="testimonials-slider-container">
              {/* Testimonial List */}
              <div className="testimonials-track" id="testimonialsTrack" ref={trackRef}>
                {/* Card 1 */}
                <div className="testimonial-card">
                  <div className="card-quote-icon"><Quote /></div>
                  <div className="star-rating">
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                  </div>
                  <p className="testimonial-text">"ERP HUB Technologies delivered our CRM integration ahead of schedule. Their team integrated seamlessly with our workflows and automated our lead management process."</p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>Gautam Chowdhary</h4>
                      <span>VP Delivery, JK Technosoft Limited</span>
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="testimonial-card">
                  <div className="card-quote-icon"><Quote /></div>
                  <div className="star-rating">
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                  </div>
                  <p className="testimonial-text">"Their QA engineers resolved critical regression bugs that had plagued our release branch. The performance testing reports they compiled were highly detailed and actionable."</p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>Anish Ohri</h4>
                      <span>Director of Quality Engineering, Trepp LLC</span>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="testimonial-card">
                  <div className="card-quote-icon"><Quote /></div>
                  <div className="star-rating">
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                    <Star className="fill" />
                  </div>
                  <p className="testimonial-text">"The UI/UX design workshop helped align our product roadmap. ERP HUB Technologies developed a custom ERP solution that automated our entire field operations workflow."</p>
                  <div className="testimonial-author">
                    <div className="author-info">
                      <h4>Abhishek Singh</h4>
                      <span>CEO, AiDash</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dots Nav */}
              <div className="slider-dots" id="sliderDots">
                {[0, 1, 2].map(index => (
                  <span
                    key={index}
                    className={`dot ${activeTestimonialIndex === index ? 'active' : ''}`}
                    data-index={index}
                    onClick={() => handleTestimonialChange(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA & Awards Section */}
        <section className="cta-awards-section">
          <div className="cta-banner-container">
            <div className="cta-banner-content">
              <h2>Grow your business with ERP HUB Technologies</h2>
              <p>Bring your ideas to reality with our Digital Transformation Services.</p>
              <button className="btn btn-accent open-contact-btn" onClick={openContactModal}>
                Get a Free Consultation <ArrowRight className="btn-arrow" />
              </button>
            </div>
          </div>

          <div className="section-container awards-container">
            <span className="section-tag text-center">ACCOLADES & PARTNERS</span>
            <h2 className="text-center">Honoring Excellence: Our Awards and Recognitions</h2>
            <p className="section-subtitle text-center">Discover how our commitment to delivering real value to clients, empowering our teams, and contributing to businesses has earned industry-wide recognition.</p>

            <div className="awards-grid">
              <div className="award-card">
                <div className="award-logo">Deloitte.</div>
                <p>Technology Fast 50 Winner</p>
              </div>
              <div className="award-card">
                <div className="award-logo">siliconindia</div>
                <p>Top 10 Software Tech Companies</p>
              </div>
              <div className="award-card">
                <div className="award-logo">Forbes</div>
                <p>Cloud Tech Innovator Recognition</p>
              </div>
              <div className="award-card">
                <div className="award-logo">Hindustan Times</div>
                <p>Best Tech Workplaces Award</p>
              </div>
              <div className="award-card">
                <div className="award-logo">CEO REVIEW</div>
                <p>Innovative Leadership Honors</p>
              </div>
              <div className="award-card">
                <div className="award-logo">ISO 27001</div>
                <p>Certified Data Security Quality</p>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Industry Insights (Blog) Section */}
        <section className="blog-section" id="blog-section">
          <div className="section-container">
            <span className="section-tag text-center">LATEST NEWS</span>
            <h2 className="text-center">Latest Industry Insights</h2>
            <p className="section-subtitle text-center">As a leading enterprise software development company, we love sharing insights from the software development industry. Check out the blog section for recent developments, trends, and breakthroughs.</p>

            <div className="blog-grid">
              {/* Blog Card 1 */}
              <article className="blog-card">
                <div className="blog-card-img-placeholder">
                  <Code2 size={48} />
                </div>
                <div className="blog-card-content">
                  <span className="blog-date">Mar 18, 2026</span>
                  <h3><a href="#">Essential Software Development Tools: A Comprehensive List for Modern Developers</a></h3>
                  <p>We detail the top developer frameworks, linters, hot-reload tools, and source control management pipelines set to dominate 2026 workflows.</p>
                  <a href="#" className="blog-read-link">Read Post <ArrowRight /></a>
                </div>
              </article>

              {/* Blog Card 2 */}
              <article className="blog-card">
                <div className="blog-card-img-placeholder font-orange">
                  <ShoppingCart size={48} />
                </div>
                <div className="blog-card-content">
                  <span className="blog-date">Jan 15, 2026</span>
                  <h3><a href="#">Quick Commerce Business Model Explained: Key Strategies for Success in a Fast-Paced Market</a></h3>
                  <p>Analyze micro-fulfillment dark stores, last-mile routing integrations, and dynamic demand forecasting algorithms driving q-commerce growth.</p>
                  <a href="#" className="blog-read-link">Read Post <ArrowRight /></a>
                </div>
              </article>

              {/* Blog Card 3 */}
              <article className="blog-card">
                <div className="blog-card-img-placeholder font-green">
                  <ShieldCheck size={48} />
                </div>
                <div className="blog-card-content">
                  <span className="blog-date">Mar 25, 2026</span>
                  <h3><a href="#">Synthetic Identity Fraud: Trends, Key Insights, and Prevention Strategies</a></h3>
                  <p>Understand how fraudsters merge fake data with real metrics, and learn how machine learning risk analysis models detect fraud patterns early.</p>
                  <a href="#" className="blog-read-link">Read Post <ArrowRight /></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions Accordion */}
        <section className="faq-section">
          <div className="section-container">
            <span className="section-tag text-center">FAQ</span>
            <h2 className="text-center">Frequently Asked Questions</h2>
            <p className="section-subtitle text-center">Got questions? We've got answers. Explore common developer and process queries below.</p>

            <div className="faq-accordion">
              {/* Accordion 1 */}
              <div className={`faq-item ${activeFaqIndex === 0 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(0)}>
                  <span>How can ERP HUB Technologies help build custom software?</span>
                  {activeFaqIndex === 0 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>ERP HUB Technologies assists at every stage of your digital journey. We provide feasibility studies, requirement analysis, UI/UX design, development, testing, deployment, and ongoing support. We build solutions that fit seamlessly into your current business workflows.</p>
                  </div>
                </div>
              </div>

              {/* Accordion 2 (Active by default) */}
              <div className={`faq-item ${activeFaqIndex === 1 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(1)}>
                  <span>How can I get started with a web or mobile project at ERP HUB Technologies?</span>
                  {activeFaqIndex === 1 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>To launch AI-powered QA pipelines:</p>
                    <ul>
                      <li>Schedule a brief 30-minute scoping workshop with our QA leads.</li>
                      <li>We evaluate your current manual test coverage and functional scripts.</li>
                      <li>Our team integrates AI testing models (like Playwright, KaneAI or custom GPT engines) to draft, self-heal, and test dynamic DOM parameters.</li>
                      <li>We connect the automated script executions to your active GitHub or GitLab CI/CD branches.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Accordion 3 */}
              <div className={`faq-item ${activeFaqIndex === 2 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(2)}>
                  <span>What are the most popular Python frameworks for web app development?</span>
                  {activeFaqIndex === 2 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>For modern enterprise APIs and apps, we highly recommend <strong>FastAPI</strong> due to its asynchronous performance and automatic Swagger docs. For larger monolithic database setups, <strong>Django</strong> remains the industry standard, while <strong>Flask</strong> is excellent for simple, lightweight microservices.</p>
                  </div>
                </div>
              </div>

              {/* Accordion 4 */}
              <div className={`faq-item ${activeFaqIndex === 3 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(3)}>
                  <span>How long does it take to develop an MVP?</span>
                  {activeFaqIndex === 3 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>Typically, a functional Minimum Viable Product (MVP) takes between <strong>4 to 8 weeks</strong> depending on complexity. We focus on establishing the primary UI workflows, core database setups, and basic authentication, enabling you to test features on live users as quickly as possible.</p>
                  </div>
                </div>
              </div>

              {/* Accordion 5 */}
              <div className={`faq-item ${activeFaqIndex === 4 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(4)}>
                  <span>Does ERP HUB Technologies provide rapid prototyping solutions?</span>
                  {activeFaqIndex === 4 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>Yes, we offer rapid prototyping sprints. In 1-2 weeks, we can build high-fidelity interactive wireframes in Figma or simple static code prototypes, helping you pitch to stakeholders or secure investor approvals without committing to heavy backend capital.</p>
                  </div>
                </div>
              </div>

              {/* Accordion 6 */}
              <div className={`faq-item ${activeFaqIndex === 5 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(5)}>
                  <span>Does ERP HUB Technologies offer CRM and automation solutions?</span>
                  {activeFaqIndex === 5 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>Yes. We build custom CRM systems, sales automation platforms, WhatsApp integrations, workflow automation, and customer engagement platforms tailored to your business model.</p>
                  </div>
                </div>
              </div>

              {/* Accordion 7 */}
              <div className={`faq-item ${activeFaqIndex === 6 ? 'active' : ''}`}>
                <button className="faq-trigger" onClick={() => toggleFaq(6)}>
                  <span>What UI/UX design services does ERP HUB Technologies offer?</span>
                  {activeFaqIndex === 6 ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
                </button>
                <div className="faq-panel">
                  <div className="faq-content-inner">
                    <p>Our designers craft modern, user-centric interfaces focused on delivering seamless digital experiences across all devices. We provide wireframing, prototyping, Figma design, and end-to-end UI implementation.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Office Presence Locations Section */}
        <section className="locations-section">
          <div className="section-container">
            <span className="section-tag text-center">OUR OFFICES</span>
            <h2 className="text-center">Our Presence Across India</h2>
            <p className="section-subtitle text-center">ERP HUB Technologies operates from key tech hubs in India, ensuring fast delivery and dedicated support for every client.</p>

            <div className="locations-grid">
              {/* Chennai */}
              <div className="location-card">
                <div className="location-header">
                  <MapPin />
                  <h3>Chennai, India (HQ)</h3>
                </div>
                <p className="address">Chennai, Tamil Nadu, India</p>
                <a href="tel:+919344096860" className="location-phone"><Phone /> +91-9344-096-860</a>
              </div>

              {/* Bengaluru */}
              <div className="location-card">
                <div className="location-header">
                  <MapPin />
                  <h3>Bengaluru, India</h3>
                </div>
                <p className="address">Bengaluru, Karnataka, India</p>
                <a href="tel:+917010509381" className="location-phone"><Phone /> +91-7010-509-381</a>
              </div>

              {/* Hyderabad */}
              <div className="location-card">
                <div className="location-header">
                  <MapPin />
                  <h3>Hyderabad, India</h3>
                </div>
                <p className="address">Hyderabad, Telangana, India</p>
                <a href="mailto:ceo@erphubtechnologies.com" className="location-phone"><Globe /> ceo@erphubtechnologies.com</a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        {/* Footer Top Badges */}
        <div className="footer-top-container">
          <div className="footer-bio">
            <a href="#" className="logo">
              <span className="logo-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </span>
              <span className="logo-text">ERP<span> HUB</span></span>
            </a>
            <p>ERP HUB Technologies — delivering innovative, secure, and user-friendly digital solutions for businesses across industries. Chennai | Bengaluru | Hyderabad.</p>
          </div>
          <div className="footer-badges">
            <h4>OUR INTEGRATION PARTNERS</h4>
            <div className="badge-row">
              <span className="partner-badge">ServiceNow</span>
              <span className="partner-badge">Microsoft Gold</span>
              <span className="partner-badge">LambdaTest</span>
              <span className="partner-badge">Katalon Partner</span>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="footer-columns-container">
          {/* Col 1 */}
          <div className="footer-col">
            <h4>About Us</h4>
            <ul>
              <li><a href="#">Our Company</a></li>
              <li><a href="#">Valued Clients</a></li>
              <li><a href="#">Industry Partners</a></li>
              <li><a href="#">Events & Meetups</a></li>
              <li><a href="#">Awards & Recognition</a></li>
              <li><a href="#case-studies-section">Success Stories</a></li>
              <li><a href="#blog-section">Blogs & Insights</a></li>
            </ul>
          </div>
          {/* Col 2 */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="#">Custom Software Dev</a></li>
              <li><a href="#">Mobile App Development</a></li>
              <li><a href="#">Web App Development</a></li>
              <li><a href="#">Software Testing & QA</a></li>
              <li><a href="#">Application Modernization</a></li>
              <li><a href="#">AI Product Development</a></li>
              <li><a href="#">Cloud & DevOps Setup</a></li>
            </ul>
          </div>
          {/* Col 3 */}
          <div className="footer-col">
            <h4>Featured Portfolios</h4>
            <ul>
              <li><a href="#">Edelweiss Asset Platform</a></li>
              <li><a href="#">Adani Utilities Cloud</a></li>
              <li><a href="#">Cover-More Claim App</a></li>
              <li><a href="#">PTTEP Telecom Pipeline</a></li>
              <li><a href="#">KFC Digital Checkout</a></li>
              <li><a href="#">IndiGo Crew Roster system</a></li>
              <li><a href="#">TAI Testing Services</a></li>
            </ul>
          </div>
          {/* Col 4 */}
          <div className="footer-col">
            <h4>ServiceNow Solutions</h4>
            <ul>
              <li><a href="#">IT Service Management</a></li>
              <li><a href="#">IT Asset Management</a></li>
              <li><a href="#">Strategic Portfolio Mgmt</a></li>
              <li><a href="#">Managed Platform Services</a></li>
              <li><a href="#">IT Operations Management</a></li>
              <li><a href="#">Organizational Change</a></li>
            </ul>
          </div>
          {/* Col 5 */}
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

        {/* Footer Bottom Column */}
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
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Youtube">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <p>&copy; 2026 ERP HUB Technologies. All Rights Reserved. | www.erphubtechnologies.com</p>
          <div className="legal-links">
            <a href="#">Terms &amp; Conditions</a>
            <span className="divider">|</span>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* Floating Action Widgets */}
      {/* Floating WhatsApp */}
      <a href="https://wa.me/919344096860" target="_blank" rel="noopener noreferrer" className="floating-whatsapp" aria-label="Chat on WhatsApp">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436.002 9.858-4.417 9.86-9.86.002-2.638-1.025-5.116-2.893-6.986C16.572 1.838 14.09 1.81 11.45 1.81c-5.438 0-9.861 4.417-9.863 9.861-.001 1.765.485 3.489 1.411 4.972l-.988 3.6 3.69-.968zm11.597-7.852c-.3-.15-1.77-.874-2.046-.975-.276-.102-.477-.152-.676.15-.199.3-.772.975-.947 1.176-.176.201-.351.226-.651.075-1.029-.514-1.7-1.094-2.38-2.25-.19-.324.19-.301.543-.997.075-.15.038-.281-.019-.382-.057-.101-.477-1.15-.654-1.576-.172-.416-.362-.359-.496-.366-.128-.006-.275-.008-.423-.008-.148 0-.389.055-.593.281-.204.226-.777.76-0.777 1.854 0 1.093.796 2.148.907 2.3.111.15 1.564 2.39 3.79 3.35 1.814.78 2.2.62 2.97.55.77-.07 1.77-.72 2.02-1.38.25-.66.25-1.23.17-1.35-.07-.12-.27-.2-.57-.35z" />
        </svg>
      </a>

      {/* Floating "Talk to Expert" Banner */}
      <button className="floating-talk-expert open-contact-btn" onClick={openContactModal}>
        <MessageSquare />
        <span>Talk to our expert!</span>
      </button>

      {/* Modal Contact Form Popup */}
      <div className={`modal-overlay ${isContactModalOpen ? 'active' : ''}`} id="contactModal">
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Request a Consultation</h3>
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
                    <label htmlFor="clientEmail">Email Address *</label>
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
                    <label htmlFor="clientPhone">Phone Number *</label>
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
                  <label htmlFor="clientSubject">Subject *</label>
                  <input
                    type="text"
                    id="clientSubject"
                    placeholder="e.g. Custom AI software discovery call"
                    required
                    value={formData.subject}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="clientMessage">Message *</label>
                  <textarea
                    id="clientMessage"
                    rows={4}
                    placeholder="Briefly describe your requirements..."
                    required
                    value={formData.message}
                    onChange={handleFormChange}
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-full" id="submitFormBtn">Submit Inquiry</button>
              </form>
            ) : (
              /* Success Notification */
              <div className="success-message active" id="successMessage">
                <div className="success-icon"><CheckCircle /></div>
                <h3>Thank You!</h3>
                <p>Your inquiry has been submitted successfully. A consultant from ERP HUB Technologies will connect with you via email or phone within 24 hours.</p>
                <button className="btn btn-primary" id="successCloseBtn" onClick={closeContactModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
