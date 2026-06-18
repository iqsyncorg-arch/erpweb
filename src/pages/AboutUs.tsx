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
  PlayCircle,
  X,
  Landmark,
  ShoppingCart,
  GraduationCap,
  Factory,
  Info,
  BookOpen,
  Calendar,
  Briefcase,
  MapPin,
  Phone,
  Globe,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  BarChart3,
  RefreshCw
} from 'lucide-react';

export default function AboutUs() {
  // --- States ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenus, setMobileSubmenus] = useState<{ [key: string]: boolean }>({
    services: false,
    products: false,
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
  }, []);

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

          {/* Corporate Logo Block - Updated with Image */}
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

              <li className="nav-item">
                <Link to="/#tech-stack-section" className="nav-link">Technologies</Link>
              </li>

              {/* Products Dropdown */}
              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link">Products <ChevronDown className="chevron-icon" /></a>
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

              {/* Who We Are Dropdown */}
              <li className="nav-item has-dropdown">
                <Link to="/about" className="nav-link" style={{ color: 'var(--color-accent-gold)' }}>
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
              <button className="mobile-dropdown-toggle" onClick={() => toggleMobileSubmenu('products')}>
                Products
                <ChevronDown style={{ transform: mobileSubmenus.products ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
              </button>
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.products ? 'active' : ''}`}>
                <li><Link to="/products/erp-suite" onClick={() => setIsMobileMenuOpen(false)}>ERP Suite</Link></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>CRM Platform</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>HRMS & Payroll</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Inventory Management</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Accounting & Finance</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>ServiceNow Solutions</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>BI & Analytics</a></li>
                <li><a href="#" onClick={() => setIsMobileMenuOpen(false)}>Workflow Automation</a></li>
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

      <main className="about-page">
        {/* ==========================================
            EDITORIAL HERO SECTION 
            Replaces the generic text blob with a split layout
        ========================================== */}
        <section className="about-hero-section" style={{ paddingTop: '180px', paddingBottom: '100px', background: 'var(--color-bg-dark, #0b0f19)' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '60px', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', color: '#fff' }}>
                  Engineering the <br />
                  <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #fff 0%, var(--color-accent-gold) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Digital Infrastructure</span> <br />
                  of Next-Gen Enterprise.
                </h1>
                <p style={{ fontSize: '1.15rem', color: '#94a3b8', lineHeight: 1.7, marginBottom: '32px' }}>
                  ERP Digital Solution designs, deploys, and scales high-performance custom application ecosystems. We bridge complex enterprise operational bottlenecks with fluid web, mobile, and cloud environments built for sustainable competitive edge.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary" onClick={openContactModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    Initiate Consultation <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                    alt="Corporate Tech Infrastructure"
                    style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            CORE CORPORATE MISSION & VISION
        ========================================== */}
        <section className="vision-mission-section" style={{ padding: '100px 0', background: '#0b0f19' }}>
          <div className="section-container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              <div style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0) 100%)', border: '1px solid rgba(255,255,255,0.05)', padding: '48px', borderRadius: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(212,163,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-accent-gold)' }}>
                  <Target size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Strategic Vision</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1rem' }}>
                  To serve as the global standard for mid-market digital evolution—architecting integrated architectures that smoothly transition legacy systems into high-throughput cloud environments, creating scalable business transparency.
                </p>
              </div>

              <div style={{ background: 'linear-gradient(180deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0) 100%)', border: '1px solid rgba(255,255,255,0.05)', padding: '48px', borderRadius: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(212,163,89,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', color: 'var(--color-accent-gold)' }}>
                  <Award size={24} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>Operational Mission</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1rem' }}>
                  To design and maintain secure, performance-optimized ecosystems driven by deliberate engineering paradigms. We minimize technological debt for our clients by executing structured roadmaps backed by reliable agile management methodologies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            VALUE PROPOSITIONS (Replaces "Why Choose Us")
        ========================================== */}
        <section className="why-choose-section-inner" style={{ padding: '100px 0', background: '#0b0f19' }}>
          <div className="section-container">
            <h2 className="text-center" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '16px', textAlign: 'center' }}>Architectural Pillars</h2>
            <p className="text-center" style={{ maxWidth: '600px', margin: '0 auto 60px', color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
              How we differentiate execution from typical baseline software implementations.
            </p>

            <div className="why-choose-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {[
                { title: 'Rigorous Technical Integrity', desc: 'Production environments strictly adhere to modern clean architecture principles, emphasizing decoupling and rigorous test suite automation.' },
                { title: 'Tailored Core Topologies', desc: 'We do not implement rigid off-the-shelf software frameworks. Every business rules engine is engineered to fit precise domain parameters.' },
                { title: 'Advanced UX Paradigms', desc: 'Front-end applications combine performance with polished interface mechanics, maintaining lightweight resource management across devices.' },
                { title: 'Hardened Security Standards', desc: 'Security mechanisms are introduced early in development, including end-to-end encryption frameworks, audit trails, and strict role-based access controls.' },
                { title: 'Deterministic Lifecycles', desc: 'Phased deployments run on accurate timelines through automated CI/CD configurations, eliminating deployment bottlenecks.' },
                { title: 'Predictable Cost Modeling', desc: 'Clear investment break-downs remove unexpected operational expenses. Project updates maintain absolute billing clarity.' },
                { title: 'Proactive Technical SLA', desc: 'Post-delivery maintenance runs under reliable support timelines, keeping critical production architecture optimized and stable.' },
                { title: 'Cross-Domain Expertise', desc: 'Engineers maintain deep contextual insight into specialized fields, managing complicated workflows from healthcare integrations to financial operations.' },
              ].map((item, idx) => (
                <div className="why-card" key={idx} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.05)', padding: '32px', borderRadius: '8px', transition: 'transform 0.3s' }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--color-accent-gold)', fontSize: '0.9rem', fontFamily: 'monospace' }}>0{idx + 1}.</span>
                    {item.title}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            REGIONAL PRESENCE / HUB MATRIX
        ========================================== */}
        <section className="locations-section" style={{ padding: '100px 0', background: '#0b0f19', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="section-container">
            <h2 className="text-center" style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', marginBottom: '16px', textAlign: 'center' }}>Regional Technical Hubs</h2>
            <p className="section-subtitle text-center" style={{ maxWidth: '600px', margin: '0 auto 60px', color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
              On-site technical support matrix and regional office coordinates.
            </p>

            <div className="locations-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {/* Chennai */}
              <div className="location-card" style={{ background: '#1e293b', padding: '40px', borderRadius: '8px', borderLeft: '4px solid var(--color-accent-gold)' }}>
                <div className="location-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', color: '#fff' }}>
                  <MapPin style={{ color: 'var(--color-accent-gold)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>Chennai (HQ)</h3>
                </div>
                <p className="address" style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>Tamil Nadu, India</p>
                <a href="tel:+919344096860" className="location-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}><Phone size={16} /> +91 93440 96860</a>
              </div>

              {/* Bengaluru */}
              <div className="location-card" style={{ background: '#1e293b', padding: '40px', borderRadius: '8px', borderLeft: '4px solid var(--color-accent-gold)' }}>
                <div className="location-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', color: '#fff' }}>
                  <MapPin style={{ color: 'var(--color-accent-gold)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>Bengaluru Office</h3>
                </div>
                <p className="address" style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>Karnataka, India</p>
                <a href="tel:+917010509381" className="location-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}><Phone size={16} /> +91 70105 09381</a>
              </div>

              {/* Hyderabad */}
              <div className="location-card" style={{ background: '#1e293b', padding: '40px', borderRadius: '8px', borderLeft: '4px solid var(--color-accent-gold)' }}>
                <div className="location-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', color: '#fff' }}>
                  <MapPin style={{ color: 'var(--color-accent-gold)' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#fff' }}>Hyderabad Network</h3>
                </div>
                <p className="address" style={{ color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>Telangana, India</p>
                <a href="mailto:ceo@erphubtechnologies.com" className="location-phone" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fff', textDecoration: 'none', fontWeight: 600 }}><Globe size={16} /> ceo@erphubtechnologies.com</a>
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
              <li><a href="#">Custom Software Dev</a></li>
              <li><a href="#">Mobile App Development</a></li>
              <li><a href="#">Web App Development</a></li>
              <li><a href="#">Software Testing & QA</a></li>
              <li><a href="#">Application Modernization</a></li>
              <li><a href="#">AI Product Development</a></li>
              <li><a href="#">Cloud & DevOps Setup</a></li>
            </ul>
          </div>
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