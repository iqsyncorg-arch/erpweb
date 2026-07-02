import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { authApi, setAuth } from '../api/client';

export default function SidepRegister() {
  const navigate = useNavigate();

  // --- States ---
  const [registerStep, setRegisterStep] = useState(1); // 1 = Form, 2 = OTP, 3 = Success
  const [registerFormData, setRegisterFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    gender: '',
    aadhaar: '',
    address: '',
    college: '',
    studentStatus: '',
    workStatus: '',
    reason: '',
  });

  const [otpFormData, setOtpFormData] = useState({
    otp: '',
    password: '',
    confirmPassword: '',
  });

  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRegisterFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegisterFormData(prev => ({ ...prev, [name]: value }));
    if (registerErrors[name]) {
      setRegisterErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleOtpFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtpFormData(prev => ({ ...prev, [name]: value }));
    if (otpErrors[name]) {
      setOtpErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const regErrors: Record<string, string> = {};

    if (!registerFormData.fullName.trim() || registerFormData.fullName.trim().length < 3) {
      regErrors.fullName = 'Full Name must be at least 3 characters.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerFormData.email.trim() || !emailRegex.test(registerFormData.email)) {
      regErrors.email = 'Please enter a valid Email ID.';
    }
    const mobileRegex = /^\d{10}$/;
    if (!registerFormData.mobile.trim() || !mobileRegex.test(registerFormData.mobile)) {
      regErrors.mobile = 'Mobile Number must be exactly 10 digits.';
    }
    if (!registerFormData.dob) {
      regErrors.dob = 'Date of Birth is required.';
    }
    if (!registerFormData.gender) {
      regErrors.gender = 'Please select a gender.';
    }
    const cleanAadhaar = registerFormData.aadhaar.replace(/\s+/g, '');
    const aadhaarRegex = /^\d{12}$/;
    if (!cleanAadhaar || !aadhaarRegex.test(cleanAadhaar)) {
      regErrors.aadhaar = 'Aadhaar Number must be exactly 12 digits.';
    }
    if (!registerFormData.address.trim()) {
      regErrors.address = 'Address is required.';
    }
    if (!registerFormData.college.trim()) {
      regErrors.college = 'College / Institution Name is required.';
    }
    if (!registerFormData.studentStatus) {
      regErrors.studentStatus = 'Please select student status.';
    }
    if (!registerFormData.workStatus) {
      regErrors.workStatus = 'Please select working status.';
    }
    if (!registerFormData.reason.trim() || registerFormData.reason.trim().length < 10) {
      regErrors.reason = 'Please explain in at least 10 characters.';
    }

    setRegisterErrors(regErrors);

    if (Object.keys(regErrors).length === 0) {
      setIsSubmitting(true);
      setApiError('');
      try {
        await authApi.register({
          ...registerFormData,
          aadhaar: registerFormData.aadhaar.replace(/\s+/g, ''),
        });
        setRegisterStep(2);
        window.scrollTo(0, 0);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setApiError('');
    try {
      await authApi.resendOtp(registerFormData.email);
      alert('OTP resent to your email.');
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const securityErrors: Record<string, string> = {};

    const otpRegex = /^\d{6}$/;
    if (!otpFormData.otp.trim() || !otpRegex.test(otpFormData.otp)) {
      securityErrors.otp = 'OTP must be exactly 6 digits.';
    }
    if (!otpFormData.password || otpFormData.password.length < 6) {
      securityErrors.password = 'Password must be at least 6 characters.';
    }
    if (otpFormData.password !== otpFormData.confirmPassword) {
      securityErrors.confirmPassword = 'Passwords do not match.';
    }

    setOtpErrors(securityErrors);

    if (Object.keys(securityErrors).length === 0) {
      setIsSubmitting(true);
      setApiError('');
      try {
        const res = await authApi.verifyOtp(
          registerFormData.email,
          otpFormData.otp,
          otpFormData.password
        );
        setAuth(res.token, res.user);
        setRegisterStep(3);
        window.scrollTo(0, 0);
      } catch (err) {
        setApiError(err instanceof Error ? err.message : 'Verification failed');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="register-page-light" style={{ padding: '80px 0' }}>
      <div className="register-light-container">
        
        <div className="register-light-header" style={{ textAlign: 'center' }}>
          <h1>ERP Digital Solution - SIDEP Student Registration</h1>
          <p>Fill in the details below to apply for the Social Initiative & Digital Empowerment Program.</p>
        </div>

        <div className="register-light-card">
          
          {/* Step 1: Student Details Form */}
          {registerStep === 1 && (
            <form onSubmit={handleRegisterSubmit} className="register-light-form-grid">
              
              {/* Personal Details */}
              <div className="register-light-section-title">Personal Details</div>
              
              <div className="register-light-group">
                <label htmlFor="regFullName">Full Name *</label>
                <input
                  type="text"
                  id="regFullName"
                  name="fullName"
                  placeholder="Enter full name"
                  value={registerFormData.fullName}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.fullName ? 'error-field' : ''}
                />
                {registerErrors.fullName && <span className="register-light-error">{registerErrors.fullName}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regEmail">Email ID *</label>
                <input
                  type="email"
                  id="regEmail"
                  name="email"
                  placeholder="Enter email address"
                  value={registerFormData.email}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.email ? 'error-field' : ''}
                />
                {registerErrors.email && <span className="register-light-error">{registerErrors.email}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regMobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="regMobile"
                  name="mobile"
                  placeholder="10-digit number"
                  value={registerFormData.mobile}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.mobile ? 'error-field' : ''}
                />
                {registerErrors.mobile && <span className="register-light-error">{registerErrors.mobile}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regDob">Date of Birth *</label>
                <input
                  type="date"
                  id="regDob"
                  name="dob"
                  value={registerFormData.dob}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.dob ? 'error-field' : ''}
                />
                {registerErrors.dob && <span className="register-light-error">{registerErrors.dob}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regGender">Gender *</label>
                <select
                  id="regGender"
                  name="gender"
                  value={registerFormData.gender}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.gender ? 'error-field' : ''}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="PreferNotToSay">Prefer not to say</option>
                </select>
                {registerErrors.gender && <span className="register-light-error">{registerErrors.gender}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regAadhaar">Aadhaar Number *</label>
                <input
                  type="text"
                  id="regAadhaar"
                  name="aadhaar"
                  placeholder="12-digit number"
                  value={registerFormData.aadhaar}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.aadhaar ? 'error-field' : ''}
                />
                {registerErrors.aadhaar && <span className="register-light-error">{registerErrors.aadhaar}</span>}
              </div>

              <div className="register-light-group register-light-span-2">
                <label htmlFor="regAddress">Address *</label>
                <textarea
                  id="regAddress"
                  name="address"
                  rows={2}
                  placeholder="Enter complete address"
                  value={registerFormData.address}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.address ? 'error-field' : ''}
                />
                {registerErrors.address && <span className="register-light-error">{registerErrors.address}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regCollege">College / Institution Name *</label>
                <input
                  type="text"
                  id="regCollege"
                  name="college"
                  placeholder="Enter college name"
                  value={registerFormData.college}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.college ? 'error-field' : ''}
                />
                {registerErrors.college && <span className="register-light-error">{registerErrors.college}</span>}
              </div>

              {/* Education & Employment */}
              <div className="register-light-section-title">Education & Employment</div>

              <div className="register-light-group">
                <label htmlFor="regStudentStatus">Current Student / Passed Out *</label>
                <select
                  id="regStudentStatus"
                  name="studentStatus"
                  value={registerFormData.studentStatus}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.studentStatus ? 'error-field' : ''}
                >
                  <option value="">Select Status</option>
                  <option value="Current Student">Current Student</option>
                  <option value="Passed Out">Passed Out</option>
                </select>
                {registerErrors.studentStatus && <span className="register-light-error">{registerErrors.studentStatus}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regWorkStatus">Working / Not Working *</label>
                <select
                  id="regWorkStatus"
                  name="workStatus"
                  value={registerFormData.workStatus}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.workStatus ? 'error-field' : ''}
                >
                  <option value="">Select Status</option>
                  <option value="Working">Working</option>
                  <option value="Not Working">Not Working</option>
                </select>
                {registerErrors.workStatus && <span className="register-light-error">{registerErrors.workStatus}</span>}
              </div>

              <div className="register-light-group register-light-full">
                <label htmlFor="regReason">Reason for Applying *</label>
                <textarea
                  id="regReason"
                  name="reason"
                  rows={2}
                  placeholder="Why do you want to join this initiative?"
                  value={registerFormData.reason}
                  onChange={handleRegisterFieldChange}
                  className={registerErrors.reason ? 'error-field' : ''}
                />
                {registerErrors.reason && <span className="register-light-error">{registerErrors.reason}</span>}
              </div>

              <div className="register-light-full" style={{ marginTop: '24px' }}>
                {apiError && <p className="register-light-error" style={{ marginBottom: '12px' }}>{apiError}</p>}
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full" style={{ background: '#0f172a', borderColor: '#0f172a', color: '#fff', padding: '14px 28px', fontSize: '15px', fontWeight: 700 }}>
                  {isSubmitting ? 'Sending OTP...' : 'Register & Continue'}
                </button>
              </div>

            </form>
          )}

          {/* Step 2: OTP Verification & Security */}
          {registerStep === 2 && (
            <form onSubmit={handleOtpSubmit} className="register-light-form-grid">
              
              <div className="register-light-section-title">OTP Verification & Security</div>

              <div className="register-light-full">
                <div className="register-light-info-box">
                  <strong>OTP Verification:</strong> A 6-digit code has been sent to <strong>{registerFormData.email}</strong>. Enter it below along with your password to complete registration.
                </div>
              </div>

              <div className="register-light-group">
                <label htmlFor="regOtp">Enter OTP *</label>
                <input
                  type="text"
                  id="regOtp"
                  name="otp"
                  placeholder="6-digit code"
                  value={otpFormData.otp}
                  onChange={handleOtpFieldChange}
                  className={otpErrors.otp ? 'error-field' : ''}
                />
                {otpErrors.otp && <span className="register-light-error">{otpErrors.otp}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regPassword">Create Password *</label>
                <input
                  type="password"
                  id="regPassword"
                  name="password"
                  placeholder="At least 6 characters"
                  value={otpFormData.password}
                  onChange={handleOtpFieldChange}
                  className={otpErrors.password ? 'error-field' : ''}
                />
                {otpErrors.password && <span className="register-light-error">{otpErrors.password}</span>}
              </div>

              <div className="register-light-group">
                <label htmlFor="regConfirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="regConfirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={otpFormData.confirmPassword}
                  onChange={handleOtpFieldChange}
                  className={otpErrors.confirmPassword ? 'error-field' : ''}
                />
                {otpErrors.confirmPassword && <span className="register-light-error">{otpErrors.confirmPassword}</span>}
              </div>

              <div className="register-light-full" style={{ marginTop: '24px', display: 'flex', gap: '16px', flexDirection: 'column' }}>
                {apiError && <p className="register-light-error">{apiError}</p>}
                <div style={{ display: 'flex', gap: '16px' }}>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full" style={{ background: '#0f172a', borderColor: '#0f172a', color: '#fff', padding: '14px 28px', fontSize: '15px', fontWeight: 700, flex: 2 }}>
                  {isSubmitting ? 'Verifying...' : 'Verify & Submit'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setRegisterStep(1)} style={{ padding: '14px 28px', fontSize: '15px', fontWeight: 700, flex: 1 }}>
                  Go Back
                </button>
                </div>
                <button type="button" className="btn btn-secondary" disabled={isSubmitting} onClick={handleResendOtp} style={{ padding: '10px', fontSize: '14px' }}>
                  Resend OTP
                </button>
              </div>

            </form>
          )}

          {/* Step 3: Success Screen */}
          {registerStep === 3 && (
            <div className="register-light-success-card">
              <div className="register-light-success-icon-wrap">
                <CheckCircle size={36} />
              </div>
              <h4>Registration Successful!</h4>
              <p>
                Thank you, <strong>{registerFormData.fullName}</strong>. Your SIDEP registration was completed successfully.
                Your login credentials have been sent to <strong>{registerFormData.email}</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/login')} style={{ background: '#0f172a', borderColor: '#0f172a', color: '#fff', minWidth: '180px' }}>
                  Go to Login
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
