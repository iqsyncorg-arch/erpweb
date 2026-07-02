import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import { authApi, setAuth } from '../api/client';

export default function Login() {
  const navigate = useNavigate();

  // --- States ---
  const [formData, setFormData] = useState({
    username: '', // email or phone
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      return;
    }

    setErrors({});
    setApiError('');
    setIsSubmitting(true);
    try {
      const res = await authApi.login(formData.username.trim(), formData.password);
      setAuth(res.token, res.user);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '80px 0', background: '#061024', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '90%', maxWidth: '440px', margin: '0 auto' }}>
        
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
                <label htmlFor="loginUsername" style={{ color: '#fff' }}>Email or Mobile Number *</label>
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
                <label htmlFor="loginPassword" style={{ color: '#fff' }}>Password *</label>
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
                <Link to="/forgot-password" style={{ color: '#FFB800', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>

              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
                {isSubmitting ? 'Signing In...' : 'Sign In'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </button>
              {apiError && <p className="register-field-error" style={{ marginTop: '12px', textAlign: 'center' }}>{apiError}</p>}
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
              New to SIDEP?{' '}
              <Link to="/sidep/register" style={{ color: '#FFB800', textDecoration: 'none', fontWeight: 600 }}>
                Apply as a Learner
              </Link>
            </div>

        </div>
      </div>
    </main>
  );
}
