import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Laptop,
  HeartHandshake,
  TrendingUp,
  BookMarked,
  Rocket,
  Target,
  Eye,
  Scale,
  Star,
  Handshake,
  Sprout,
} from 'lucide-react';

const MISSION_COMMITMENTS = [
  'Delivering high-quality digital literacy and technology education.',
  'Enhancing employability through industry-aligned training and certifications.',
  'Supporting students and job seekers with career guidance, internships, and placement assistance.',
  'Promoting digital inclusion among women, rural youth, and underserved communities.',
  'Encouraging innovation, entrepreneurship, and lifelong learning.',
  'Building strong partnerships with educational institutions, industries, NGOs, and government organizations.',
  'Contributing to India\'s vision of a digitally empowered and knowledge-driven society.',
];

const VISION_POINTS = [
  'Every student has access to quality technology education.',
  'Every job seeker possesses industry-ready skills.',
  'Every woman has equal opportunities for digital and economic empowerment.',
  'Every rural community benefits from digital inclusion and technology awareness.',
  'Educational institutions and industries work together to bridge the skills gap.',
  'Technology serves as a powerful tool for social progress, innovation, and sustainable development.',
];

const CORE_VALUES = [
  { icon: <TrendingUp size={28} />, title: 'Empowerment', desc: 'Creating opportunities that help individuals achieve their full potential.' },
  { icon: <Lightbulb size={28} />, title: 'Innovation', desc: 'Embracing emerging technologies to solve real-world challenges.' },
  { icon: <Scale size={28} />, title: 'Integrity', desc: 'Building trust through transparency, ethics, and accountability.' },
  { icon: <Star size={28} />, title: 'Excellence', desc: 'Delivering high-quality education, training, and professional services.' },
  { icon: <Users size={28} />, title: 'Inclusivity', desc: 'Ensuring equal access to learning and career opportunities for all.' },
  { icon: <Handshake size={28} />, title: 'Collaboration', desc: 'Working with institutions, industries, communities, and partners to maximize social impact.' },
  { icon: <Sprout size={28} />, title: 'Sustainability', desc: 'Creating long-term value through continuous learning and responsible digital transformation.' },
];

const CONFERENCE_GALLERY = [
  { src: '/assets/sidep_conference_1.png', alt: 'SIDEP digital empowerment conference with adult learners' },
  { src: '/assets/sidep_conference_2.png', alt: 'Adult students in a digital skills workshop' },
  { src: '/assets/sidep_conference_3.png', alt: 'Technology seminar for job seekers and professionals' },
  { src: '/assets/sidep_training_1.png', alt: 'Hands-on technology bootcamp for adult students' },
  { src: '/assets/sidep_training_2.png', alt: 'Career mentoring session with adult learners' },
];

export default function Sidep() {
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
          <Link to="/" className="logo" id="logoLink" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <img
              src="/assets/logo.png"
              alt="ERP HUB Technologies"
              className="logo-image"
              style={{ height: '36px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => {
                // Fallback text if the image path is broken
                e.currentTarget.style.display = 'none';
                const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                if (sibling) sibling.style.display = 'flex';
              }}
            />
            <span className="logo-text">ERP<span> HUB</span></span>
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

              {/* Industries Dropdown */}
              <li className="nav-item has-dropdown">
                <a href="#" className="nav-link">Industries <ChevronDown className="chevron-icon" /></a>
                <div className="mega-menu mega-menu-2col">
                  <div className="mega-col">
                    <h3>Core Industries</h3>
                    <ul>
                      <li><Link to="/industries/fintech-banking"><Landmark className="menu-icon" /> Fintech & Banking</Link></li>
                      <li><Link to="/industries/insurance"><Umbrella className="menu-icon" /> Insurance</Link></li>
                      <li><Link to="/industries/ecommerce"><ShoppingCart className="menu-icon" /> E-commerce</Link></li>
                      <li><Link to="/industries/education"><GraduationCap className="menu-icon" /> Education</Link></li>
                      <li><Link to="/industries/healthcare"><Activity className="menu-icon" /> Healthcare</Link></li>
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
          <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/assets/logo.png" alt="ERP HUB" className="logo-image" style={{ height: '28px', width: 'auto' }} />
            <span className="logo-text">ERP<span> HUB</span></span>
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
              <ul className={`mobile-dropdown-menu ${mobileSubmenus.industries ? 'active' : ''}`}>
                <li><Link to="/industries/fintech-banking" onClick={() => setIsMobileMenuOpen(false)}>Fintech & Banking</Link></li>
                <li><Link to="/industries/insurance" onClick={() => setIsMobileMenuOpen(false)}>Insurance</Link></li>
                <li><Link to="/industries/ecommerce" onClick={() => setIsMobileMenuOpen(false)}>E-commerce</Link></li>
                <li><Link to="/industries/education" onClick={() => setIsMobileMenuOpen(false)}>Education</Link></li>
                <li><Link to="/industries/healthcare" onClick={() => setIsMobileMenuOpen(false)}>Healthcare</Link></li>
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
                <li><Link to="/sidep" onClick={() => setIsMobileMenuOpen(false)}>SIDEP</Link></li>
              </ul>
            </li>
            <li className="mobile-nav-item">
              <Link to="/#case-studies-section" onClick={() => setIsMobileMenuOpen(false)}>Success Stories</Link>
            </li>
          </ul>
          <button className="btn btn-primary mobile-cta-btn open-contact-btn" onClick={openContactModal}>Contact Us</button>
        </div>
      </div>

      <main style={{ background: '#f8fafc' }}>

        {/* ══════════════════════════════════════════
            HERO — Full-bleed background video
        ══════════════════════════════════════════ */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 0,
            }}
          >
            <source
              src="https://res.cloudinary.com/dq6gr5zjc/video/upload/v1782999216/Create_a_cinematic_CSR_documen_hdtifu.mp4"
              type="video/mp4"
            />
          </video>

          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(10,16,35,0.72) 0%, rgba(10,20,50,0.60) 60%, rgba(10,16,35,0.88) 100%)',
          }} />

          {/* Content — centered */}
          <div style={{
            position: 'relative', zIndex: 2,
            width: '90%', maxWidth: '860px',
            margin: '0 auto',
            paddingTop: '160px',
            paddingBottom: '160px',
            textAlign: 'center',
          }}>


            <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, color: '#fff', marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>
              ERP HUB Social
            </h1>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '32px', fontFamily: 'Montserrat, sans-serif', background: 'linear-gradient(90deg, #FFB800 0%, #FFD770 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Initiative & Digital<br />Empowerment Program
            </h1>

            {/* Vision quote block */}
            <div style={{ borderLeft: '4px solid #FFB800', paddingLeft: '24px', marginBottom: '48px', textAlign: 'left', maxWidth: '680px', margin: '0 auto 48px' }}>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.08rem', lineHeight: 1.85, margin: 0, fontStyle: 'italic' }}>
                "To empower individuals and communities through technology, education, and digital innovation — enabling inclusive growth and sustainable career opportunities."
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link to="/sidep/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(90deg, #FFB800, #FFD770)', color: '#0f172a', padding: '15px 36px', borderRadius: '50px', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', boxShadow: '0 8px 32px rgba(255,184,0,0.4)', textDecoration: 'none' }}>
                Join the Initiative <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>



        {/* ══════════════════════════════════════════
            IMPACT STATS BAND
        ══════════════════════════════════════════ */}
        <section style={{ background: '#FFB800', padding: '24px 0' }}>
          <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { icon: <Users size={24} />, val: '1500+', label: 'Students Trained' },
              { icon: <Globe size={24} />, val: '20+', label: 'Communities Impacted' },
              { icon: <Laptop size={24} />, val: '15+', label: 'Programs Offered' },
              { icon: <HeartHandshake size={24} />, val: '30+', label: 'Industry Partners' },
            ].map((s) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ color: '#0f172a', opacity: 0.7 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1, fontFamily: 'Montserrat, sans-serif' }}>{s.val}</div>
                  <div style={{ fontSize: '0.78rem', color: '#0f172a', opacity: 0.65, fontWeight: 600, letterSpacing: '0.5px' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════
            ABOUT THE INITIATIVE
        ══════════════════════════════════════════ */}
        <section style={{ padding: '100px 0', background: '#f8fafc' }}>
          <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(255,184,0,0.12)', color: '#b8860b', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', padding: '6px 18px', borderRadius: '50px', marginBottom: '16px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase' }}>
                About the Initiative
              </span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.2, margin: '0 0 16px' }}>
                Empowering Communities Through <span style={{ color: '#FFB800' }}>Digital Innovation</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'start', marginBottom: '64px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.85, margin: 0 }}>
                  The ERP HUB Social Initiative &amp; Digital Empowerment Program is a flagship Corporate Social Responsibility (CSR) initiative by ERP HUB Technologies, dedicated to creating a digitally empowered and inclusive society. We believe that access to quality education, digital skills, and career opportunities should be available to everyone, regardless of their economic or social background.
                </p>
                <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.85, margin: 0 }}>
                  Our initiative focuses on bridging the gap between education and industry by providing practical, industry-relevant training, career guidance, and digital literacy programs. Through strategic collaborations with educational institutions, corporate organizations, government bodies, NGOs, and community partners, we strive to equip students, job seekers, women, rural youth, entrepreneurs, and working professionals with the skills needed to thrive in today&apos;s digital economy.
                </p>
              </div>
              <div>
                <img
                  src="/assets/sidep_conference_1.png"
                  alt="SIDEP conference with adult learners"
                  style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(15,23,42,0.1)', border: '1px solid #e2e8f0' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px' }}>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.85, margin: 0 }}>
                We conduct workshops, awareness campaigns, skill development programs, certification courses, career mentoring, internship opportunities, and technology awareness sessions in emerging domains such as SAP ERP, Artificial Intelligence (AI), Data Analytics, Cloud Computing, Cyber Security, Web Technologies, and Digital Transformation.
              </p>
              <p style={{ color: '#475569', fontSize: '1.02rem', lineHeight: 1.85, margin: 0 }}>
                Beyond technical training, our program also emphasizes soft skills, leadership, entrepreneurship, financial literacy, communication, and employability enhancement, ensuring holistic personal and professional development.
              </p>
            </div>

            <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '20px', padding: '40px 48px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                At ERP HUB Technologies, we measure our success by the lives we transform, the careers we build, and the communities we empower. Every participant represents another step toward a stronger, digitally skilled, and future-ready India.
              </p>
            </div>

            <div style={{ marginTop: '48px', textAlign: 'center' }}>
              <Link to="/sidep/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0f172a', color: '#fff', padding: '16px 36px', borderRadius: '50px', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                Register for SIDEP <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CONFERENCE & TRAINING GALLERY
        ══════════════════════════════════════════ */}
        <section style={{ padding: '80px 0', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', marginBottom: '12px' }}>
                Learning in Action
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
                Real workshops, conferences, and mentoring sessions empowering adult learners across communities.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              {CONFERENCE_GALLERY.map((img) => (
                <div key={img.src} style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(15,23,42,0.08)', border: '1px solid #e2e8f0' }}>
                  <img src={img.src} alt={img.alt} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            MISSION & VISION
        ══════════════════════════════════════════ */}
        <section style={{
          padding: '120px 0',
          position: 'relative',
          background: 'url(/assets/sidep_conference_3.png) no-repeat center center / cover',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(6, 14, 30, 0.94) 0%, rgba(13, 27, 62, 0.9) 100%)',
            zIndex: 0
          }} />

          <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat, sans-serif', lineHeight: 1.15 }}>
                Mission &amp; Vision
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '40px' }}>

              {/* Mission */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                padding: '48px 40px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(0,229,255,0.12)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <Target size={28} style={{ color: '#00E5FF' }} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>Our Mission</h3>
                <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.85, margin: '0 0 28px' }}>
                  To empower individuals and communities by providing accessible, affordable, and industry-focused digital education, professional skill development, and career opportunities that enable sustainable employment, innovation, and inclusive economic growth.
                </p>
                <p style={{ color: '#FFB800', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>We are committed to:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {MISSION_COMMITMENTS.map((m, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FFB800', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <CheckCircle size={12} style={{ color: '#0f172a' }} />
                      </div>
                      <span style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vision */}
              <div style={{
                background: 'rgba(13, 27, 62, 0.55)',
                backdropFilter: 'blur(16px)',
                borderRadius: '24px',
                padding: '48px 40px',
                border: '1px solid rgba(255, 184, 0, 0.2)'
              }}>
                <div style={{ width: '56px', height: '56px', background: 'rgba(255,184,0,0.15)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <Eye size={28} style={{ color: '#FFB800' }} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>Our Vision</h3>
                <p style={{ color: '#cbd5e1', fontSize: '1.02rem', lineHeight: 1.85, margin: '0 0 24px' }}>
                  To become a leading catalyst for digital transformation and social empowerment by creating opportunities that enable every individual to learn, grow, innovate, and succeed in the digital era.
                </p>
                <p style={{ color: '#FFB800', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '16px' }}>We envision a future where:</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {VISION_POINTS.map((v, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(0,229,255,0.2)', border: '1px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                        <CheckCircle size={12} style={{ color: '#00E5FF' }} />
                      </div>
                      <span style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.65 }}>{v}</span>
                    </li>
                  ))}
                </ul>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.75, margin: '28px 0 0', fontStyle: 'italic' }}>
                  Our long-term vision is to build a globally recognized ecosystem of learning, innovation, and community development that transforms lives through education, technology, and meaningful opportunities.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CORE VALUES
        ══════════════════════════════════════════ */}
        <section id="core-values" style={{ padding: '100px 0', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
          <div style={{ width: '90%', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(14,165,233,0.12)', color: '#0369a1', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', padding: '6px 18px', borderRadius: '50px', marginBottom: '16px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase' }}>
                What We Stand For
              </span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
                Our Core Values
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              {CORE_VALUES.map((val) => (
                <div key={val.title} style={{ background: '#fff', borderRadius: '20px', padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                  <div style={{ width: '56px', height: '56px', background: 'rgba(255,184,0,0.12)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8860b', marginBottom: '20px' }}>
                    {val.icon}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px', fontFamily: 'Montserrat, sans-serif' }}>{val.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.93rem', lineHeight: 1.7, margin: 0 }}>{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PROGRAM COMPONENTS — Vertical Timeline
        ══════════════════════════════════════════ */}
        <section style={{ padding: '100px 0', background: '#fff' }}>
          <div style={{ width: '90%', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '72px' }}>
              <span style={{ display: 'inline-block', background: 'rgba(255,184,0,0.12)', color: '#b8860b', fontSize: '11px', fontWeight: 800, letterSpacing: '2.5px', padding: '6px 18px', borderRadius: '50px', marginBottom: '16px', fontFamily: 'Montserrat, sans-serif', textTransform: 'uppercase' }}>
                What We Offer
              </span>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Montserrat, sans-serif' }}>
                Program Components
              </h2>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{ position: 'absolute', left: '30px', top: '0', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, #FFB800, #00E5FF)', borderRadius: '2px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', paddingLeft: '80px' }}>
                {[
                  { icon: <BookMarked size={20} />, title: 'Digital Skills Bootcamp', desc: 'Intensive short-term programs covering Python, web development, data basics, and AI fundamentals — designed for beginners with zero prior knowledge.', tag: 'Foundational' },
                  { icon: <Laptop size={20} />, title: 'Industry Internship Program', desc: 'Live project internships where participants work alongside ERP HUB engineers on real client deliverables, building a portfolio that speaks for itself.', tag: 'Experiential' },
                  { icon: <Compass size={20} />, title: 'Career Launch Sessions', desc: 'Structured workshops on resume building, LinkedIn optimization, interview preparation, and mock interviews conducted by senior professionals.', tag: 'Career Readiness' },
                  { icon: <HeartHandshake size={20} />, title: 'Women in Tech Track', desc: 'A dedicated, safe, and encouraging learning track tailored for women entering or re-entering the technology field, with a supportive peer community.', tag: 'Inclusion' },
                  { icon: <Globe size={20} />, title: 'Rural Digital Outreach', desc: 'Taking mobile training labs, offline learning kits, and local-language instruction directly into Tier-2 and Tier-3 cities and villages.', tag: 'Outreach' },
                  { icon: <TrendingUp size={20} />, title: 'Mentorship Network', desc: 'One-on-one and group mentorship connections between learners and experienced ERP HUB professionals, alumni, and industry leaders.', tag: 'Mentorship' },
                ].map((comp, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '28px', position: 'relative' }}>
                    {/* Circle on timeline */}
                    <div style={{ position: 'absolute', left: '-62px', top: '0', width: '44px', height: '44px', background: '#0f172a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFB800', border: '3px solid #FFB800', boxShadow: '0 0 0 6px rgba(255,184,0,0.1)', flexShrink: 0 }}>
                      {comp.icon}
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '32px 36px', flex: 1, border: '1px solid #f1f5f9', transition: 'border-color 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', margin: 0 }}>{comp.title}</h3>
                        <span style={{ background: 'rgba(255,184,0,0.15)', color: '#92660a', fontSize: '11px', fontWeight: 700, padding: '3px 12px', borderRadius: '50px', letterSpacing: '0.5px' }}>{comp.tag}</span>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>{comp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA STRIP
        ══════════════════════════════════════════ */}
        <section style={{ background: 'linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)', padding: '80px 0' }}>
          <div style={{ width: '90%', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(0,0,0,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Rocket size={30} style={{ color: '#0f172a' }} />
            </div>
            <h2 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#0f172a', fontFamily: 'Montserrat, sans-serif', marginBottom: '16px', lineHeight: 1.2 }}>
              Be Part of the Change
            </h2>
            <p style={{ color: 'rgba(15,23,42,0.7)', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
              Whether you are a learner, a mentor, a volunteer, or a corporate sponsor — there is a place for you in SIDEP. Join us in building an inclusive digital India.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/sidep/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0f172a', color: '#FFB800', padding: '16px 40px', borderRadius: '50px', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
                Apply as a Learner <ArrowRight size={16} />
              </Link>
              <button onClick={openContactModal} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.25)', color: '#0f172a', padding: '16px 40px', borderRadius: '50px', fontWeight: 800, fontSize: '15px', border: '2px solid rgba(0,0,0,0.15)', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
                Partner With Us
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-top-container">
          <div className="footer-bio">
            <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '16px' }}>
              <img src="/assets/logo.png" alt="ERP HUB" className="logo-image" style={{ height: '32px', width: 'auto' }} />
              <span className="logo-text">ERP<span> HUB</span></span>
            </Link>
            <p>ERP HUB Technologies designs, manages, and scales high-performance enterprise platforms and dedicated product lifecycles across major industrial tech corridors.</p>
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
          <p>&copy; 2026 ERP HUB Technologies. All Rights Reserved. | www.erphubtechnologies.com</p>
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
                <p>Your institutional discovery requirements have been securely recorded. An executive architecture representative from ERP HUB Technologies will connect with your management channel within 24 business hours.</p>
                <button className="btn btn-primary" id="successCloseBtn" onClick={closeContactModal}>Dismiss Window</button>
              </div>
            )}
          </div>
        </div>
      </div>

    </>
  );
}