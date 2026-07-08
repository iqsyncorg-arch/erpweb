import { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { studentApi, type SupportRequestRecord } from '../../api/client';

const CATEGORIES = [
  'Technical Issue',
  'Payment Query',
  'Quiz Assistance',
  'Certification Help',
  'General Inquiry',
];

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

export default function StudentSupportTab() {
  const [tickets, setTickets] = useState<SupportRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getSupportRequests();
      if (res.success) {
        setTickets(res.data);
      }
    } catch (err) {
      console.error('Failed to load support tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subject.trim()) {
      setError('Please enter a subject.');
      return;
    }
    if (!message.trim()) {
      setError('Please enter your message.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await studentApi.submitSupportRequest(category, subject.trim(), message.trim());
      if (res.success) {
        setSuccess('Support ticket submitted successfully!');
        setSubject('');
        setMessage('');
        setCategory(CATEGORIES[0]);
        // Refresh ticket list
        await fetchTickets();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit support request');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="payment-page">
      <div className="payment-page-grid">
        {/* Support Request Form */}
        <div className="dash-card payment-form-card">
          <div className="payment-method-header">
            <HelpCircle size={20} style={{ color: '#FFB800' }} />
            <h3 className="payment-section-title">Create a Support Ticket</h3>
          </div>
          <p className="payment-section-subtitle">
            Need help? Select a category, describe your issue, and our support team will assist you as soon as possible.
          </p>

          {error && <div className="payment-form-error">{error}</div>}
          {success && (
            <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#dcfce7', color: '#16a34a', borderRadius: '8px', fontSize: '14px', fontWeight: 600 }}>
              {success}
            </div>
          )}

          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label htmlFor="supportCategory">Category *</label>
              <select
                id="supportCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}
                disabled={submitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-form-group">
              <label htmlFor="supportSubject">Subject *</label>
              <input
                id="supportSubject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Can't access Week 1 SAP schedule"
                required
                disabled={submitting}
              />
            </div>

            <div className="register-form-group">
              <label htmlFor="supportMessage">Message *</label>
              <textarea
                id="supportMessage"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Please describe your issue in detail..."
                required
                disabled={submitting}
              />
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-full payment-submit-btn">
              {submitting ? 'Submitting Ticket...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* Support Tickets History */}
        <div className="payment-methods">
          <div className="dash-card">
            <h3 className="payment-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MessageSquare size={20} style={{ color: '#0284c7' }} />
              My Support Tickets
            </h3>

            {loading ? (
              <p style={{ color: '#64748b', fontSize: '14px' }}>Loading ticket history...</p>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                <Clock size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '13px', margin: 0 }}>You have not submitted any support tickets yet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickets.map((ticket) => {
                  const isExpanded = expandedId === ticket.id;
                  const isResolved = ticket.status === 'resolved';

                  return (
                    <div
                      key={ticket.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(ticket.id)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: '#64748b',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {ticket.category}
                            </span>
                            <span
                              className={`status-badge ${isResolved ? 'active' : 'pending'}`}
                              style={{ padding: '2px 6px', fontSize: '10px' }}
                            >
                              {isResolved ? 'Resolved' : 'Pending'}
                            </span>
                          </div>
                          <strong style={{ fontSize: '14px', color: '#0f172a', fontWeight: 700 }}>
                            {ticket.subject}
                          </strong>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {formatDateTime(ticket.createdAt)}
                          </span>
                        </div>
                        <div style={{ color: '#94a3b8' }}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div
                          style={{
                            padding: '12px 16px',
                            borderTop: '1px solid #e2e8f0',
                            background: '#fff',
                            fontSize: '13px',
                            color: '#334155',
                            lineHeight: 1.5,
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#64748b', marginBottom: '4px', fontSize: '11px' }}>
                            YOUR MESSAGE:
                          </div>
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{ticket.message}</p>

                          {isResolved && (
                            <div
                              style={{
                                marginTop: '12px',
                                padding: '10px 12px',
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                borderRadius: '6px',
                                color: '#065f46',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              <CheckCircle2 size={16} style={{ color: '#059669', flexShrink: 0 }} />
                              <div>
                                <strong style={{ fontSize: '12px', display: 'block' }}>Resolved</strong>
                                <span style={{ fontSize: '11px', color: '#047857' }}>
                                  Our team has marked this issue as resolved.
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
