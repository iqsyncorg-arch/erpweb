import { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { adminApi, type SupportRequestRecord } from '../../api/client';

const SUPPORT_PAGE_SIZE = 10;

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

export default function AdminSupportPanel() {
  const [tickets, setTickets] = useState<SupportRequestRecord[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'pending' | 'resolved' | 'all'>('pending');
  const [isLoading, setIsLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getSupportRequests(statusFilter, page, SUPPORT_PAGE_SIZE);
      if (res.success) {
        setTickets(res.data);
        setTotalTickets(res.pagination.total);
      }
    } catch (err) {
      console.error('Failed to fetch support requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTickets();
  }, [statusFilter, page]);

  const handleResolve = async (id: string) => {
    if (!window.confirm('Are you sure you want to mark this support ticket as resolved?')) return;
    try {
      setResolvingId(id);
      const res = await adminApi.resolveSupportRequest(id);
      if (res.success) {
        // Refresh ticket list
        await fetchTickets();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to resolve support ticket');
    } finally {
      setResolvingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const totalPages = Math.max(1, Math.ceil(totalTickets / SUPPORT_PAGE_SIZE));
  const showingFrom = totalTickets === 0 ? 0 : (page - 1) * SUPPORT_PAGE_SIZE + 1;
  const showingTo = Math.min(page * SUPPORT_PAGE_SIZE, totalTickets);
  const pageNumbers = buildPageList(page, totalPages);

  return (
    <div className="dash-card">
      <div className="dash-card-header">
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={22} style={{ color: '#FFB800' }} />
            Support Requests
          </h3>
          <p style={{ color: '#64748b', fontSize: '13px', margin: '4px 0 0' }}>
            Manage student support requests, review user messages, and mark issues as resolved.
          </p>
        </div>
        <div className="dash-card-header-actions">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontWeight: 600 }}
          >
            <option value="pending">Pending Review</option>
            <option value="resolved">Resolved</option>
            <option value="all">All Requests</option>
          </select>
        </div>
      </div>

      {isLoading && tickets.length === 0 ? (
        <p style={{ color: '#64748b', margin: 20 }}>Loading support requests...</p>
      ) : tickets.length === 0 ? (
        <div className="payment-admin-empty" style={{ padding: '40px 0' }}>
          <Clock size={40} style={{ color: '#94a3b8' }} />
          <p>No support requests in this category.</p>
        </div>
      ) : (
        <div className="admin-payments-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Student Details</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Submitted On</th>
                <th>Status</th>
                <th style={{ minWidth: '150px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => {
                const isExpanded = expandedId === ticket.id;
                const isResolved = ticket.status === 'resolved';

                return (
                  <>
                    <tr key={ticket.id} style={{ cursor: 'pointer' }} onClick={() => toggleExpand(ticket.id)}>
                      <td>
                        <button
                          type="button"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
                          onClick={(e) => { e.stopPropagation(); toggleExpand(ticket.id); }}
                        >
                          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </td>
                      <td>
                        <div className="payment-admin-table-student-name">{ticket.studentName}</div>
                        <div className="payment-admin-table-student-meta">
                          {ticket.studentEmail}
                          <br />
                          {ticket.studentMobile}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>{ticket.category}</span>
                      </td>
                      <td>
                        <strong style={{ fontSize: '13px', color: '#0f172a' }}>{ticket.subject}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{formatDateTime(ticket.createdAt)}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${isResolved ? 'active' : 'pending'}`}>
                          {isResolved ? 'Resolved' : 'Pending'}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {!isResolved ? (
                          <button
                            type="button"
                            className="payment-admin-table-btn-approve"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                            disabled={resolvingId === ticket.id}
                            onClick={() => handleResolve(ticket.id)}
                          >
                            <CheckCircle size={14} />
                            {resolvingId === ticket.id ? '...' : 'Mark Resolved'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={14} /> Resolved
                          </span>
                        )}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr style={{ background: '#f8fafc' }}>
                        <td colSpan={7}>
                          <div style={{ padding: '16px', borderLeft: '3px solid #cbd5e1', background: '#fff', borderRadius: '4px', margin: '4px 0' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
                              Full Support Message
                            </div>
                            <p style={{ margin: 0, fontSize: '13px', color: '#1e293b', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                              {ticket.message}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalTickets > 0 && (
        <div className="pagination-container pagination-container--enhanced">
          <div className="pagination-summary">
            Showing <strong>{showingFrom}</strong>–<strong>{showingTo}</strong> of <strong>{totalTickets}</strong> requests
            <span className="pagination-page-label"> · Page {page} of {totalPages}</span>
          </div>
          <div className="pagination-buttons">
            <button type="button" className="pagination-btn" onClick={() => setPage(1)} disabled={page === 1 || isLoading}>«</button>
            <button type="button" className="pagination-btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1 || isLoading}>Previous</button>
            {pageNumbers.map((pNum, idx) =>
              pNum === 'ellipsis' ? (
                <span key={`support-ellipsis-${idx}`} className="pagination-ellipsis">…</span>
              ) : (
                <button key={pNum} type="button" className={`pagination-btn ${page === pNum ? 'active' : ''}`} onClick={() => setPage(pNum)} disabled={isLoading}>{pNum}</button>
              )
            )}
            <button type="button" className="pagination-btn" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages || isLoading}>Next</button>
            <button type="button" className="pagination-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages || isLoading}>»</button>
          </div>
        </div>
      )}
    </div>
  );
}
