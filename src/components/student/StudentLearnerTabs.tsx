import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  Download,
  GraduationCap,
  Lock,
  QrCode,
  Upload,
} from 'lucide-react';
import type { ScheduleEntry } from '../../api/client';
import { getUploadUrl } from '../../api/client';

export interface ProgramModule {
  id: number;
  title: string;
  duration: string;
  description: string;
}

export interface StudentProgress {
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  paymentAmount: number | null;
  paymentPaidAt: string | null;
  enrolledProgram: string | null;
  scholarshipCodeUsed: string | null;
  quizCompleted: boolean;
  quizProgram: string | null;
  quizScore: number | null;
  scholarship: {
    active: boolean;
    code: string | null;
    expiresAt: string | null;
  };
  pricing: {
    standard: number;
    scholarship: number;
    applicable: number;
  };
  modules: ProgramModule[];
  certificationEligible: boolean;
  modulesUnlocked: boolean;
  paymentSubmission?: {
    status: 'pending' | 'approved' | 'rejected';
    submittedAt: string;
    billingName?: string;
    billingEmail?: string;
    billingAddress?: string;
    transactionId?: string;
    amount?: number;
    useScholarship?: boolean;
    rejectionReason?: string;
  } | null;
}

export interface PaymentFormDefaults {
  fullName: string;
  email: string;
  mobile: string;
  address: string;
}

const BANK_DETAILS = {
  accountNumber: '50200097950610',
  companyName: 'ERP HUB TECHNOLOGIES',
  ifsc: 'HDFC0004610',
  bank: 'HDFC Bank',
};

const UPI_ID = 'informixcorpltd-3@okicici';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

interface TabProps {
  progress: StudentProgress;
  scholarshipCountdown?: string;
  isPaying: boolean;
  onPay: (useScholarship: boolean) => void;
  onGoToQuiz: () => void;
  onGoToPayment?: () => void;
}

interface PaymentTabProps extends TabProps {
  formDefaults: PaymentFormDefaults;
  onSubmitPayment: (payload: {
    billingName: string;
    billingEmail: string;
    billingAddress: string;
    mobile: string;
    transactionId: string;
    useScholarship: boolean;
    amount: number;
    notes?: string;
    screenshot: File;
  }) => Promise<void>;
}

interface ScheduleTabProps {
  progress: StudentProgress;
  scheduleEntries: ScheduleEntry[];
  scheduleLoading: boolean;
  onGoToQuiz: () => void;
  onGoToPayment: () => void;
}

function copyText(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    alert(`${label} copied to clipboard`);
  });
}

export function StudentPaymentTab({
  progress,
  scholarshipCountdown,
  isPaying,
  formDefaults,
  onSubmitPayment,
  onGoToQuiz,
}: PaymentTabProps) {
  const isPaid = progress.paymentStatus === 'paid';
  const isPending = progress.paymentStatus === 'pending';
  const scholarshipActive = progress.scholarship.active;
  const submission = progress.paymentSubmission;

  const [useScholarship, setUseScholarship] = useState(scholarshipActive);
  const [billingName, setBillingName] = useState(formDefaults.fullName);
  const [billingEmail, setBillingEmail] = useState(formDefaults.email);
  const [billingAddress, setBillingAddress] = useState(formDefaults.address);
  const [mobile, setMobile] = useState(formDefaults.mobile);
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const selectedAmount = useScholarship && scholarshipActive
    ? progress.pricing.scholarship
    : progress.pricing.standard;

  if (!progress.quizCompleted) {
    return (
      <div className="dash-card dash-alert-banner">
        <div className="dash-alert-banner-content">
          <AlertTriangle size={24} style={{ color: '#d97706', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#92400e', fontSize: '14px' }}>Assessment Required</strong>
            <span style={{ display: 'block', fontSize: '13px', color: '#b45309', marginTop: '4px' }}>
              Complete your skills assessment first to unlock program payment and scholarship pricing.
            </span>
          </div>
        </div>
        <button type="button" onClick={onGoToQuiz} className="dash-alert-action-btn">
          Take Quiz
        </button>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="dash-card">
        <div className="payment-status-header">
          <div className="payment-status-icon payment-status-icon--success">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="payment-section-title">Payment Verified</h3>
            <p className="payment-section-subtitle">
              Enrolled in <strong>{progress.enrolledProgram}</strong>
            </p>
          </div>
        </div>
        <div className="dash-grid-3">
          <div className="payment-info-box">
            <span className="payment-info-label">Amount Paid</span>
            <strong className="payment-info-value">{formatCurrency(progress.paymentAmount ?? 0)}</strong>
          </div>
          <div className="payment-info-box">
            <span className="payment-info-label">Scholarship Applied</span>
            <strong className="payment-info-value">{progress.scholarshipCodeUsed ? 'Yes' : 'No'}</strong>
          </div>
          <div className="payment-info-box">
            <span className="payment-info-label">Verified On</span>
            <strong className="payment-info-value payment-info-value--sm">
              {progress.paymentPaidAt ? formatDateTime(progress.paymentPaidAt) : '—'}
            </strong>
          </div>
        </div>
      </div>
    );
  }

  if (isPending || submission?.status === 'pending') {
    return (
      <div className="dash-card payment-pending-card">
        <div className="payment-status-header">
          <div className="payment-status-icon payment-status-icon--pending">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="payment-section-title">Payment Under Review</h3>
            <p className="payment-section-subtitle">
              We received your payment proof. Our team will verify and activate your enrollment shortly.
            </p>
          </div>
        </div>
        {submission && (
          <div className="payment-submission-summary">
            <div><span>Name</span><strong>{submission.billingName || '—'}</strong></div>
            <div><span>Email</span><strong>{submission.billingEmail || '—'}</strong></div>
            <div><span>Amount</span><strong>{submission.amount != null ? formatCurrency(submission.amount) : '—'}</strong></div>
            <div><span>Transaction ID</span><strong>{submission.transactionId || '—'}</strong></div>
            <div><span>Submitted</span><strong>{formatDateTime(submission.submittedAt)}</strong></div>
          </div>
        )}
      </div>
    );
  }

  if (submission?.status === 'rejected') {
    return (
      <div className="dash-card payment-rejected-card">
        <div className="payment-status-header">
          <div className="payment-status-icon payment-status-icon--error">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="payment-section-title">Payment Rejected</h3>
            <p className="payment-section-subtitle">
              {submission.rejectionReason || 'Your payment proof could not be verified. Please resubmit with correct details.'}
            </p>
          </div>
        </div>
        <PaymentFormContent
          progress={progress}
          scholarshipActive={scholarshipActive}
          scholarshipCountdown={scholarshipCountdown}
          useScholarship={useScholarship}
          setUseScholarship={setUseScholarship}
          billingName={billingName}
          setBillingName={setBillingName}
          billingEmail={billingEmail}
          setBillingEmail={setBillingEmail}
          billingAddress={billingAddress}
          setBillingAddress={setBillingAddress}
          mobile={mobile}
          setMobile={setMobile}
          transactionId={transactionId}
          setTransactionId={setTransactionId}
          notes={notes}
          setNotes={setNotes}
          screenshot={screenshot}
          setScreenshot={setScreenshot}
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
          selectedAmount={selectedAmount}
          isPaying={isPaying}
          formError={formError}
          onSubmit={async () => {
            setFormError('');
            if (!billingName.trim() || !billingEmail.trim() || !billingAddress.trim()) {
              setFormError('Please fill in name, email, and billing address.');
              return;
            }
            if (!transactionId.trim()) {
              setFormError('Please enter your UTR / transaction reference number.');
              return;
            }
            if (!screenshot) {
              setFormError('Please upload a payment screenshot.');
              return;
            }
            try {
              await onSubmitPayment({
                billingName: billingName.trim(),
                billingEmail: billingEmail.trim(),
                billingAddress: billingAddress.trim(),
                mobile: mobile.trim(),
                transactionId: transactionId.trim(),
                useScholarship: useScholarship && scholarshipActive,
                amount: selectedAmount,
                notes: notes.trim() || undefined,
                screenshot,
              });
            } catch (err) {
              setFormError(err instanceof Error ? err.message : 'Failed to submit payment');
            }
          }}
        />
      </div>
    );
  }

  return (
    <PaymentFormContent
      progress={progress}
      scholarshipActive={scholarshipActive}
      scholarshipCountdown={scholarshipCountdown}
      useScholarship={useScholarship}
      setUseScholarship={setUseScholarship}
      billingName={billingName}
      setBillingName={setBillingName}
      billingEmail={billingEmail}
      setBillingEmail={setBillingEmail}
      billingAddress={billingAddress}
      setBillingAddress={setBillingAddress}
      mobile={mobile}
      setMobile={setMobile}
      transactionId={transactionId}
      setTransactionId={setTransactionId}
      notes={notes}
      setNotes={setNotes}
      screenshot={screenshot}
      setScreenshot={setScreenshot}
      previewUrl={previewUrl}
      setPreviewUrl={setPreviewUrl}
      selectedAmount={selectedAmount}
      isPaying={isPaying}
      formError={formError}
      onSubmit={async () => {
        setFormError('');
        if (!billingName.trim() || !billingEmail.trim() || !billingAddress.trim()) {
          setFormError('Please fill in name, email, and billing address.');
          return;
        }
        if (!transactionId.trim()) {
          setFormError('Please enter your UTR / transaction reference number.');
          return;
        }
        if (!screenshot) {
          setFormError('Please upload a payment screenshot.');
          return;
        }
        try {
          await onSubmitPayment({
            billingName: billingName.trim(),
            billingEmail: billingEmail.trim(),
            billingAddress: billingAddress.trim(),
            mobile: mobile.trim(),
            transactionId: transactionId.trim(),
            useScholarship: useScholarship && scholarshipActive,
            amount: selectedAmount,
            notes: notes.trim() || undefined,
            screenshot,
          });
        } catch (err) {
          setFormError(err instanceof Error ? err.message : 'Failed to submit payment');
        }
      }}
    />
  );
}

function PaymentFormContent({
  progress,
  scholarshipActive,
  scholarshipCountdown,
  useScholarship,
  setUseScholarship,
  billingName,
  setBillingName,
  billingEmail,
  setBillingEmail,
  billingAddress,
  setBillingAddress,
  mobile,
  setMobile,
  transactionId,
  setTransactionId,
  notes,
  setNotes,
  screenshot,
  setScreenshot,
  previewUrl,
  setPreviewUrl,
  selectedAmount,
  isPaying,
  formError,
  onSubmit,
}: {
  progress: StudentProgress;
  scholarshipActive: boolean;
  scholarshipCountdown?: string;
  useScholarship: boolean;
  setUseScholarship: (v: boolean) => void;
  billingName: string;
  setBillingName: (v: string) => void;
  billingEmail: string;
  setBillingEmail: (v: string) => void;
  billingAddress: string;
  setBillingAddress: (v: string) => void;
  mobile: string;
  setMobile: (v: string) => void;
  transactionId: string;
  setTransactionId: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  screenshot: File | null;
  setScreenshot: (v: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (v: string | null) => void;
  selectedAmount: number;
  isPaying: boolean;
  formError: string;
  onSubmit: () => Promise<void>;
}) {
  const handleFileChange = (file: File | null) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshot(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div className="payment-page">
      <div className="payment-page-grid">
        {/* Payment methods */}
        <div className="payment-methods">
          <div className="dash-card payment-fee-card">
            <h3 className="payment-section-title">Program Fee</h3>
            <p className="payment-section-subtitle">{progress.quizProgram}</p>
            <div className="payment-fee-options">
              <label className={`payment-fee-option ${useScholarship && scholarshipActive ? 'selected' : ''} ${!scholarshipActive ? 'disabled' : ''}`}>
                <input
                  type="radio"
                  name="feeType"
                  checked={useScholarship && scholarshipActive}
                  disabled={!scholarshipActive}
                  onChange={() => setUseScholarship(true)}
                />
                <div>
                  <span className="payment-fee-label">Scholarship Fee</span>
                  <strong className="payment-fee-amount">{formatCurrency(progress.pricing.scholarship)}</strong>
                  {scholarshipActive && progress.scholarship.code && (
                    <code className="payment-scholarship-code">{progress.scholarship.code}</code>
                  )}
                  {scholarshipActive && scholarshipCountdown && (
                    <span className="payment-expiry">Expires in: {scholarshipCountdown}</span>
                  )}
                  {!scholarshipActive && <span className="payment-expiry">Scholarship not active</span>}
                </div>
              </label>
              <label className={`payment-fee-option ${!useScholarship || !scholarshipActive ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="feeType"
                  checked={!useScholarship || !scholarshipActive}
                  onChange={() => setUseScholarship(false)}
                />
                <div>
                  <span className="payment-fee-label">Standard Fee</span>
                  <strong className="payment-fee-amount">{formatCurrency(progress.pricing.standard)}</strong>
                </div>
              </label>
            </div>
            <p className="payment-pay-amount">
              Pay: <strong>{formatCurrency(selectedAmount)}</strong>
            </p>
          </div>

          <div className="dash-card">
            <div className="payment-method-header">
              <Building2 size={20} />
              <h3 className="payment-section-title">Direct Bank Transfer</h3>
            </div>
            <div className="payment-bank-details">
              <div className="payment-bank-row">
                <span>Account Number</span>
                <div className="payment-copy-row">
                  <strong>{BANK_DETAILS.accountNumber}</strong>
                  <button type="button" className="payment-copy-btn" onClick={() => copyText(BANK_DETAILS.accountNumber, 'Account number')}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="payment-bank-row">
                <span>Company Name</span>
                <strong>{BANK_DETAILS.companyName}</strong>
              </div>
              <div className="payment-bank-row">
                <span>IFSC Code</span>
                <div className="payment-copy-row">
                  <strong>{BANK_DETAILS.ifsc}</strong>
                  <button type="button" className="payment-copy-btn" onClick={() => copyText(BANK_DETAILS.ifsc, 'IFSC code')}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="payment-bank-row">
                <span>Bank</span>
                <strong>{BANK_DETAILS.bank}</strong>
              </div>
            </div>
          </div>

          <div className="dash-card payment-upi-card">
            <div className="payment-method-header">
              <QrCode size={20} />
              <h3 className="payment-section-title">UPI Payment</h3>
            </div>
            <div className="payment-upi-body">
              <img
                src="/assets/payments/upi-qr.png"
                alt="UPI QR code for ERP Hub Technologies"
                className="payment-upi-qr"
              />
              <p className="payment-upi-id">
                UPI ID: <strong>{UPI_ID}</strong>
                <button type="button" className="payment-copy-btn" onClick={() => copyText(UPI_ID, 'UPI ID')}>
                  <Copy size={14} />
                </button>
              </p>
              <p className="payment-upi-hint">Scan to pay with any UPI app (Google Pay, PhonePe, Paytm, etc.)</p>
            </div>
          </div>
        </div>

        {/* Payment proof form */}
        <div className="dash-card payment-form-card">
          <div className="payment-method-header">
            <CreditCard size={20} />
            <h3 className="payment-section-title">Submit Payment Proof</h3>
          </div>
          <p className="payment-section-subtitle">
            After transferring the fee, fill in your billing details and upload the payment screenshot for verification.
          </p>

          {formError && <div className="payment-form-error">{formError}</div>}

          <form
            className="payment-form"
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }}
          >
            <div className="register-form-group">
              <label htmlFor="payName">Full Name *</label>
              <input id="payName" type="text" value={billingName} onChange={(e) => setBillingName(e.target.value)} required />
            </div>
            <div className="register-form-group">
              <label htmlFor="payEmail">Email Address *</label>
              <input id="payEmail" type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} required />
            </div>
            <div className="register-form-group">
              <label htmlFor="payMobile">Mobile Number</label>
              <input id="payMobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91 XXXXXXXXXX" />
            </div>
            <div className="register-form-group">
              <label htmlFor="payAddress">Billing Address *</label>
              <textarea id="payAddress" rows={3} value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} required placeholder="Street, city, state, PIN code" />
            </div>
            <div className="register-form-group">
              <label htmlFor="payTxn">UTR / Transaction Reference *</label>
              <input id="payTxn" type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required placeholder="Enter transaction ID from your bank/UPI app" />
            </div>
            <div className="register-form-group">
              <label htmlFor="payNotes">Additional Notes</label>
              <textarea id="payNotes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any extra details (optional)" />
            </div>
            <div className="register-form-group">
              <label htmlFor="payScreenshot">Payment Screenshot *</label>
              <div className="payment-upload-zone">
                <input
                  id="payScreenshot"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  className="payment-file-input"
                />
                <label htmlFor="payScreenshot" className="payment-upload-label">
                  <Upload size={20} />
                  <span>{screenshot ? screenshot.name : 'Click to upload screenshot (PNG, JPG, or PDF)'}</span>
                </label>
                {previewUrl && screenshot?.type.startsWith('image/') && (
                  <img src={previewUrl} alt="Payment screenshot preview" className="payment-screenshot-preview" />
                )}
              </div>
            </div>
            <button type="submit" disabled={isPaying} className="btn btn-primary btn-full payment-submit-btn">
              {isPaying ? 'Submitting...' : `Submit Payment Proof — ${formatCurrency(selectedAmount)}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function StudentScheduleTab({
  progress,
  scheduleEntries,
  scheduleLoading,
  onGoToQuiz,
  onGoToPayment,
}: ScheduleTabProps) {
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const calendarDays = useMemo(() => buildCalendarDays(viewMonth), [viewMonth]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, ScheduleEntry[]>();
    for (const entry of scheduleEntries) {
      const start = new Date(entry.startDate);
      const end = entry.endDate ? new Date(entry.endDate) : start;
      const cursor = new Date(start);
      while (cursor <= end) {
        const key = toDateKey(cursor);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(entry);
        cursor.setDate(cursor.getDate() + 1);
      }
    }
    return map;
  }, [scheduleEntries]);

  const upcoming = useMemo(
    () =>
      [...scheduleEntries]
        .filter((e) => new Date(e.startDate) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()),
    [scheduleEntries]
  );

  const monthLabel = viewMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  if (!progress.quizCompleted) {
    return (
      <LockedMessage
        title="Complete Assessment First"
        message="Take the skills assessment to view your training schedule calendar."
        actionLabel="Take Quiz"
        onAction={onGoToQuiz}
      />
    );
  }

  if (!progress.modulesUnlocked) {
    return (
      <LockedMessage
        title="Payment Required"
        message="Complete and verify your program payment to unlock the training schedule calendar."
        actionLabel="Go to Payment"
        onAction={onGoToPayment}
      />
    );
  }

  return (
    <div className="schedule-page">
      <div className="dash-card schedule-header-card">
        <div className="schedule-header-top">
          <CalendarDays size={22} style={{ color: '#0284c7' }} />
          <div>
            <h3 className="payment-section-title">{progress.enrolledProgram} — Training Schedule</h3>
            <p className="payment-section-subtitle">View class dates, sessions, and downloadable schedule files.</p>
          </div>
        </div>
      </div>

      {scheduleLoading ? (
        <div className="dash-card"><p style={{ color: '#64748b', margin: 0 }}>Loading schedule...</p></div>
      ) : scheduleEntries.length === 0 ? (
        <div className="dash-card schedule-empty">
          <CalendarDays size={40} style={{ color: '#94a3b8' }} />
          <p>No schedule published yet. Check back soon — your admin will upload the training calendar.</p>
        </div>
      ) : (
        <div className="schedule-layout">
          <div className="dash-card schedule-calendar-card">
            <div className="schedule-calendar-nav">
              <button type="button" className="schedule-nav-btn" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}>
                ‹
              </button>
              <strong>{monthLabel}</strong>
              <button type="button" className="schedule-nav-btn" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}>
                ›
              </button>
            </div>
            <div className="schedule-calendar-grid schedule-calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="schedule-calendar-grid">
              {calendarDays.map((day, idx) => {
                if (!day) return <span key={`empty-${idx}`} className="schedule-day schedule-day--empty" />;
                const key = toDateKey(day);
                const events = eventsByDate.get(key) ?? [];
                const isToday = key === toDateKey(new Date());
                return (
                  <div key={key} className={`schedule-day ${isToday ? 'schedule-day--today' : ''} ${events.length ? 'schedule-day--has-event' : ''}`}>
                    <span className="schedule-day-num">{day.getDate()}</span>
                    {events.length > 0 && <span className="schedule-day-dot" title={events.map((e) => e.title).join(', ')} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="schedule-events-list">
            <h4 className="schedule-list-title">Upcoming Sessions</h4>
            {upcoming.length === 0 ? (
              <div className="dash-card"><p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>No upcoming sessions this month.</p></div>
            ) : (
              upcoming.map((entry) => (
                <div key={entry.id} className="dash-card schedule-event-card">
                  <div className="schedule-event-date">
                    <CalendarDays size={16} />
                    {formatDate(entry.startDate)}
                    {entry.endDate && entry.endDate !== entry.startDate && ` — ${formatDate(entry.endDate)}`}
                  </div>
                  <h5 className="schedule-event-title">{entry.title}</h5>
                  {entry.program && <span className="schedule-event-program">{entry.program}</span>}
                  {entry.description && <p className="schedule-event-desc">{entry.description}</p>}
                  {entry.fileUrl && (
                    <a href={getUploadUrl(entry.fileUrl)} target="_blank" rel="noopener noreferrer" className="schedule-download-link">
                      <Download size={14} />
                      {entry.fileName || 'Download schedule file'}
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function buildCalendarDays(monthStart: Date): (Date | null)[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function StudentCertificationTab({ progress }: TabProps) {
  const enrolledProgramName = progress.enrolledProgram || progress.quizProgram || 'Selenium';
  const scoreText = progress.quizScore != null ? `${progress.quizScore}/10` : '7/10';
  const programCode = enrolledProgramName.replace(/\s+/g, '').slice(0, 6).toUpperCase();
  const certId = `SIDEP-${programCode}-2026`;

  return (
    <div className="dash-card" style={{ textAlign: 'center', padding: '40px 32px' }}>
      <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255, 184, 0, 0.15)', color: '#FFB800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <GraduationCap size={36} />
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: 800 }}>SIDEP Program Certification</h3>
      <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>
        Congratulations! You are enrolled and eligible for your digital empowerment certificate.
      </p>

      <div className="certificate-card-wrapper">
        <div className="certificate-card-blurred">
          <p style={{ margin: '0 0 4px', fontSize: '12px', letterSpacing: '2px', color: '#FFB800', textTransform: 'uppercase' }}>ERP Digital Solution</p>
          <h4 style={{ margin: '0 0 16px', fontSize: '22px', fontWeight: 800 }}>Certificate of Enrollment</h4>
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#94a3b8' }}>Program</p>
          <p style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700 }}>{enrolledProgramName}</p>
          <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#94a3b8' }}>Assessment Score</p>
          <p style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 700 }}>{scoreText}</p>
          <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Certificate ID: {certId}</p>
        </div>

        <div className="certificate-lock-overlay">
          <div className="certificate-lock-circle">
            <Lock size={26} />
          </div>
          <h5 className="certificate-lock-title">Locked</h5>
          <span className="certificate-lock-subtitle">Available after training completion</span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '480px', margin: '0 auto' }}>
        Your official certificate will be issued after training completion. Our team will contact you with the final credential document.
      </p>
    </div>
  );
}

function LockedMessage({
  title,
  message,
  actionLabel,
  onAction,
}: {
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="dash-card dash-alert-banner">
      <div className="dash-alert-banner-content">
        <Lock size={24} style={{ color: '#64748b', flexShrink: 0 }} />
        <div>
          <strong style={{ fontSize: '14px' }}>{title}</strong>
          <span style={{ display: 'block', fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{message}</span>
        </div>
      </div>
      <button type="button" onClick={onAction} className="dash-alert-action-btn">
        {actionLabel}
      </button>
    </div>
  );
}
