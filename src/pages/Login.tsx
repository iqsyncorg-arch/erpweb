import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();

  // --- States ---
  const [formData, setFormData] = useState({
    username: '', // email or phone
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Please enter your Email ID or Mobile Number.';
    }
    if (!formData.password) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      navigate('/dashboard');
    }
  };

  return (
    <main style={{ padding: '80px 0', background: '#061024', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '90%', maxWidth: '440px', margin: '0 auto' }}>
        
        {!isLoggedIn ? (
          <div style={{ background: '#0d1b3e', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 184, 0, 0.15)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>
                Account Login
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                Access your digital initiatives dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="register-form-group">
                <label htmlFor="loginUsername">Email or Mobile Number *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    id="loginUsername"
                    name="username"
                    placeholder="Enter registered email or mobile"
                    value={formData.username}
                    onChange={handleFieldChange}
                    className={errors.username ? 'error-field' : ''}
                    style={{ paddingLeft: '44px' }}
                  />
                  <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
                {errors.username && <span className="register-field-error">{errors.username}</span>}
              </div>

              <div className="register-form-group">
                <label htmlFor="loginPassword">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="loginPassword"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleFieldChange}
                    className={errors.password ? 'error-field' : ''}
                    style={{ paddingLeft: '44px', paddingRight: '44px' }}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="register-field-error">{errors.password}</span>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#cbd5e1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ width: 'auto', margin: 0, accentColor: '#FFB800' }} />
                  Remember Me
                </label>
                <a href="#" style={{ color: '#FFB800', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>Forgot Password?</a>
              </div>

              <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
                Sign In <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
              New to SIDEP?{' '}
              <Link to="/sidep/register" style={{ color: '#FFB800', textDecoration: 'none', fontWeight: 600 }}>
                Apply as a Learner
              </Link>
            </div>

          </div>
        ) : (
          <div style={{ background: '#0d1b3e', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 184, 0, 0.15)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)', textAlign: 'center' }}>
            <div className="register-success-icon-wrap" style={{ width: '64px', height: '64px', background: 'rgba(255, 184, 0, 0.1)', color: '#FFB800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 20px rgba(255,184,0,0.2)' }}>
              <CheckCircle size={36} style={{ margin: '0 auto' }} />
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>Welcome Back!</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              You have successfully signed into your student portal. Your enrollment dashboard is initializing.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <button type="button" className="btn btn-primary btn-full" onClick={() => navigate('/sidep')}>
                Go to SIDEP Main Page
              </button>
              <button type="button" className="btn btn-secondary btn-full" onClick={() => setIsLoggedIn(false)}>
                Sign Out
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
