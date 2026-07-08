import { useState } from 'react';
import {
  CheckCircle,
  Clock,
  CreditCard,
  ExternalLink,
  XCircle,
} from 'lucide-react';
import { getUploadUrl, type PaymentSubmissionRecord } from '../../api/client';

const PAYMENTS_PAGE_SIZE = 10;

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('en-IN')} ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
};

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 1) return total === 0 ? [] : [1];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | 'ellipsis')[] = [];
  const push = (value: number | 'ellipsis') => {
    if (items[items.length - 1] !== value) items.push(value);
  };
  push(1);
  if (current > 3) push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let page = start; page <= end; page += 1) push(page);
  if (current < total - 2) push('ellipsis');
  push(total);
  return items;
}

interface Props {
  payments: PaymentSubmissionRecord[];
  totalPayments: number;
  paymentsPage: number;
  paymentStatusFilter: 'pending' | 'approved' | 'rejected' | 'all';
  isLoading: boolean;
  reviewingId: string | null;
  onFilterChange: (status: 'pending' | 'approved' | 'rejected' | 'all') => void;
  onPageChange: (page: number) => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

export default function AdminPaymentsPanel({
  payments,
  totalPayments,
  paymentsPage,
  paymentStatusFilter,
  isLoading,
  reviewingId,
  onFilterChange,
  onPageChange,
  onApprove,
  onReject,
}: Props) {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const totalPages = Math.max(1, Math.ceil(totalPayments / PAYMENTS_PAGE_SIZE));
  const showingFrom = totalPayments === 0 ? 0 : (paymentsPage - 1) * PAYMENTS_PAGE_SIZE + 1;
  const showingTo = Math.min(paymentsPage * PAYMENTS_PAGE_SIZE, totalPayments);
  const pageNumbers = buildPageList(paymentsPage, totalPages);

  const handleRejectSubmit = async (id: string) => {
    await onReject(id, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={22} style={{ color: '#0284c7' }} />
            Payment Reviews
          </h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            Review student payment proofs, approve verified payments, or reject invalid submissions.
          </p>
        </div>
        <div className="dash-card-header-actions">
          <select
            value={paymentStatusFilter}
            onChange={(e) => onFilterChange(e.target.value as Props['paymentStatusFilter'])}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
          >
            <option value="pending">Pending Review</option>
            <option value="approved">All Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Submissions</option>
          </select>
        </div>
      </div>

      {isLoading && payments.length === 0 ? (
        <p style={{ color: '#64748b', margin: 20 }}>Loading payment submissions...</p>
      ) : payments.length === 0 ? (
        <div className="payment-admin-empty">
          <Clock size={40} style={{ color: '#94a3b8' }} />
          <p>No payment submissions in this category.</p>
        </div>
      ) : (
        <div className="admin-payments-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Training Program</th>
                <th>Payment Info</th>
                <th>Transaction Details</th>
                <th>Proof of Payment</th>
                <th style={{ minWidth: '180px' }}>Status &amp; Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  {/* Student Details */}
                  <td>
                    <div className="payment-admin-table-student-name">{payment.studentName}</div>
                    <div className="payment-admin-table-student-meta">
                      {payment.studentEmail}
                      <br />
                      {payment.studentMobile}
                    </div>
                  </td>

                  {/* Training Program */}
                  <td>
                    <div className="payment-admin-table-course">{payment.program}</div>
                  </td>

                  {/* Payment Info & Billing */}
                  <td>
                    <div className="payment-admin-table-billing-name">{payment.billingName}</div>
                    <div className="payment-admin-table-billing-email">{payment.billingEmail}</div>
                    <div className="payment-admin-table-billing-address">{payment.billingAddress}</div>
                    {payment.notes && (
                      <div className="payment-admin-table-billing-note">Note: {payment.notes}</div>
                    )}
                  </td>

                  {/* Transaction Details */}
                  <td>
                    <div className="payment-admin-table-amount">
                      {formatCurrency(payment.amount)}
                      {payment.useScholarship && (
                        <span className="payment-admin-table-scholarship-badge">Scholarship</span>
                      )}
                    </div>
                    <div className="payment-admin-table-tx-id">{payment.transactionId}</div>
                    <div className="payment-admin-table-date">{formatDateTime(payment.submittedAt)}</div>
                  </td>

                  {/* Proof of Payment */}
                  <td>
                    {payment.screenshotUrl.toLowerCase().endsWith('.pdf') ? (
                      <a
                        href={getUploadUrl(payment.screenshotUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="schedule-download-link"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                      >
                        <ExternalLink size={14} /> View PDF
                      </a>
                    ) : (
                      <a href={getUploadUrl(payment.screenshotUrl)} target="_blank" rel="noopener noreferrer">
                        <img
                          src={getUploadUrl(payment.screenshotUrl)}
                          alt="Payment screenshot"
                          className="payment-admin-table-proof-img"
                        />
                      </a>
                    )}
                  </td>

                  {/* Status & Action */}
                  <td>
                    <div className="payment-admin-actions-cell">
                      <div>
                        <span className={`status-badge ${payment.status === 'approved' ? 'active' : payment.status === 'pending' ? 'pending' : 'expired'}`}>
                          {payment.status === 'pending' ? 'Pending' : payment.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      </div>

                      {payment.status === 'pending' && (
                        <div className="payment-admin-table-btn-group">
                          {rejectingId === payment.id ? (
                            <div className="payment-admin-table-reject-form">
                              <textarea
                                rows={2}
                                placeholder="Reason (optional)"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="payment-admin-table-reject-textarea"
                              />
                              <div className="payment-admin-table-reject-actions">
                                <button
                                  type="button"
                                  className="payment-admin-table-btn-cancel"
                                  onClick={() => { setRejectingId(null); setRejectReason(''); }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="payment-admin-table-btn-confirm-reject"
                                  disabled={reviewingId === payment.id}
                                  onClick={() => handleRejectSubmit(payment.id)}
                                >
                                  Confirm
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="payment-admin-table-btn-approve"
                                disabled={reviewingId === payment.id}
                                onClick={() => onApprove(payment.id)}
                              >
                                <CheckCircle size={14} />
                                {reviewingId === payment.id ? '...' : 'Approve'}
                              </button>
                              <button
                                type="button"
                                className="payment-admin-table-btn-reject"
                                disabled={reviewingId === payment.id}
                                onClick={() => setRejectingId(payment.id)}
                              >
                                <XCircle size={14} />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      {payment.status === 'rejected' && payment.rejectionReason && (
                        <div className="payment-admin-table-rejection-note">
                          Reason: {payment.rejectionReason}
                        </div>
                      )}

                      {payment.status === 'approved' && payment.reviewedAt && (
                        <div className="payment-admin-table-approved-note">
                          Approved: {formatDateTime(payment.reviewedAt)}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPayments > 0 && (
        <div className="pagination-container pagination-container--enhanced">
          <div className="pagination-summary">
            Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of <strong>{totalPayments}</strong> submissions
            <span className="pagination-page-label"> · Page {paymentsPage} of {totalPages}</span>
          </div>
          <div className="pagination-buttons">
            <button type="button" className="pagination-btn" onClick={() => onPageChange(1)} disabled={paymentsPage === 1 || isLoading}>«</button>
            <button type="button" className="pagination-btn" onClick={() => onPageChange(Math.max(1, paymentsPage - 1))} disabled={paymentsPage === 1 || isLoading}>Previous</button>
            {pageNumbers.map((pNum, idx) =>
              pNum === 'ellipsis' ? (
                <span key={`pay-ellipsis-${idx}`} className="pagination-ellipsis">…</span>
              ) : (
                <button key={pNum} type="button" className={`pagination-btn ${paymentsPage === pNum ? 'active' : ''}`} onClick={() => onPageChange(pNum)} disabled={isLoading}>{pNum}</button>
              )
            )}
            <button type="button" className="pagination-btn" onClick={() => onPageChange(Math.min(totalPages, paymentsPage + 1))} disabled={paymentsPage === totalPages || isLoading}>Next</button>
            <button type="button" className="pagination-btn" onClick={() => onPageChange(totalPages)} disabled={paymentsPage === totalPages || isLoading}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}

export { PAYMENTS_PAGE_SIZE };
