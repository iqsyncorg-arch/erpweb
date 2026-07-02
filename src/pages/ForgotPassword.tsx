import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authApi } from '../api/client';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!identifier.trim()) {
      newErrors.identifier = 'Please enter your registered email or mobile number.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setIsSubmitting(true);
    try {
      const res = await authApi.forgotPassword(identifier.trim());
      setAccountEmail(res.email);
      setStep(2);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to send reset OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!accountEmail) return;
    setApiError('');
    setIsSubmitting(true);
    try {
      await authApi.resendForgotPasswordOtp(accountEmail);
      alert('Password reset OTP resent to your email.');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const otpRegex = /^\d{6}$/;

    if (!otp.trim() || !otpRegex.test(otp)) {
      newErrors.otp = 'OTP must be exactly 6 digits.';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setApiError('');
    setIsSubmitting(true);
    try {
      await authApi.resetPassword(accountEmail, otp.trim(), password);
      setStep(3);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main style={{ padding: '80px 0', background: '#061024', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '90%', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ background: '#0d1b3e', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255, 184, 0, 0.15)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)' }}>
          {step === 1 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>
                  Forgot Password
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                  Enter your registered email or mobile number. We will send a 6-digit OTP to your email.
                </p>
              </div>

              <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="register-form-group">
                  <label htmlFor="forgotIdentifier" style={{ color: '#fff' }}>Email or Mobile Number *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      id="forgotIdentifier"
                      name="identifier"
                      placeholder="Enter registered email or mobile"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (errors.identifier) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.identifier;
                            return copy;
                          });
                        }
                      }}
                      className={errors.identifier ? 'error-field' : ''}
                      style={{ paddingLeft: '44px' }}
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                  {errors.identifier && <span className="register-field-error">{errors.identifier}</span>}
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full" style={{ marginTop: '12px' }}>
                  {isSubmitting ? 'Sending OTP...' : 'Send Reset OTP'} <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                </button>
                {apiError && <p className="register-field-error" style={{ textAlign: 'center' }}>{apiError}</p>}
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 800, marginBottom: '8px', fontFamily: 'Montserrat, sans-serif' }}>
                  Reset Password
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>
                  A 6-digit OTP has been sent to <strong style={{ color: '#FFB800' }}>{accountEmail}</strong>. Enter it below with your new password.
                </p>
              </div>

              <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="register-form-group">
                  <label htmlFor="resetOtp" style={{ color: '#fff' }}>Enter OTP *</label>
                  <input
                    type="text"
                    id="resetOtp"
                    name="otp"
                    placeholder="6-digit code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      if (errors.otp) {
                        setErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.otp;
                          return copy;
                        });
                      }
                    }}
                    className={errors.otp ? 'error-field' : ''}
                  />
                  {errors.otp && <span className="register-field-error">{errors.otp}</span>}
                </div>

                <div className="register-form-group">
                  <label htmlFor="newPassword" style={{ color: '#fff' }}>New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="password"
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.password;
                            return copy;
                          });
                        }
                      }}
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

                <div className="register-form-group">
                  <label htmlFor="confirmNewPassword" style={{ color: '#fff' }}>Confirm New Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmNewPassword"
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy.confirmPassword;
                            return copy;
                          });
                        }
                      }}
                      className={errors.confirmPassword ? 'error-field' : ''}
                      style={{ paddingLeft: '44px', paddingRight: '44px' }}
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="register-field-error">{errors.confirmPassword}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full">
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                  <button type="button" disabled={isSubmitting} onClick={handleResendOtp} className="btn btn-secondary btn-full" style={{ padding: '12px' }}>
                    Resend OTP
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="btn btn-secondary btn-full" style={{ padding: '12px' }}>
                    Go Back
                  </button>
                </div>
                {apiError && <p className="register-field-error" style={{ textAlign: 'center' }}>{apiError}</p>}
              </form>
            </>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle size={36} />
              </div>
              <h1 style={{ color: '#fff', fontSize: '26px', fontWeight: 800, marginBottom: '12px' }}>Password Reset Successful</h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '28px' }}>
                Your password has been updated. A confirmation email has been sent to <strong style={{ color: '#FFB800' }}>{accountEmail}</strong>.
              </p>
              <button type="button" className="btn btn-primary btn-full" onClick={() => navigate('/login')}>
                Go to Login
              </button>
            </div>
          )}

          {step !== 3 && (
            <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#FFB800', textDecoration: 'none', fontWeight: 600 }}>
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
