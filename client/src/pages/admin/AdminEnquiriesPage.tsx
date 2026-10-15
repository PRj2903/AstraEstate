import React, { useEffect, useState, useCallback } from 'react';
import {
  Inbox,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Enquiry, EnquiryStatus, PaginationMeta } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EnquiryDetailModal } from '../../components/admin/EnquiryDetailModal';

export const AdminEnquiriesPage: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  // Selected Modal
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminEnquiries({
        search,
        status: statusFilter,
        page,
        limit: 15,
      });
      setEnquiries(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer enquiries.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page]);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleDelete = async (enquiry: Enquiry) => {
    if (window.confirm(`Delete enquiry ${enquiry.refNumber} from ${enquiry.name}?`)) {
      try {
        await api.deleteAdminEnquiry(enquiry.id);
        showNotification(`Enquiry ${enquiry.refNumber} removed.`);
        fetchEnquiries();
      } catch (err: any) {
        alert(err.message || 'Failed to delete enquiry');
      }
    }
  };

  const handleOpenDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setModalOpen(true);
  };

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'CONTACTED':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'IN_PROGRESS':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'CLOSED':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'SPAM':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <AdminLayout pageTitle="Private Client Enquiries">
      {actionNotice && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4 mb-6">
        <div>
          <h2 className="font-serif text-2xl text-slate-900">Client Enquiry Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor client acquisition requests, update progress statuses, and maintain private internal notes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-stone-100">
          <div className="sm:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by client name, email, telephone, or reference..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW (Unopened)</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
              <option value="SPAM">SPAM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>
            Total Records: <span className="text-slate-900 font-semibold">{meta.total}</span> enquiries
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving client enquiries..." />
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-xs">{error}</div>
        ) : enquiries.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-serif text-2xl text-slate-900">No Enquiries Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are currently no customer inquiries matching your active filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-slate-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Associated Property</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {enquiries.map((enq) => (
                  <tr
                    key={enq.id}
                    onClick={() => handleOpenDetail(enq)}
                    className="hover:bg-stone-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {enq.refNumber}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{enq.name}</div>
                      <div className="text-[10px] text-slate-500">{enq.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-slate-700 border border-stone-200">
                        {enq.preferredContact}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {enq.property ? (
                        <div className="truncate max-w-[180px]" title={enq.property.title}>
                          <span className="font-medium text-slate-900">{enq.property.title}</span>
                          <span className="text-[10px] text-slate-500 block font-mono">
                            {enq.property.refNumber}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">General Consultation</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {enq.internalNotes ? (
                        <span className="truncate max-w-[140px] block text-stone-700 font-medium" title={enq.internalNotes}>
                          {enq.internalNotes}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenDetail(enq)}
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-slate-800 text-[11px] font-medium transition-colors"
                      >
                        View / Edit
                      </button>

                      <button
                        onClick={() => handleDelete(enq)}
                        className="p-1 rounded bg-stone-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 inline-block align-middle transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && !loading && (
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Page {meta.page} of {meta.totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-stone-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="p-2 rounded-lg border border-stone-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Detail Drawer Modal */}
      <EnquiryDetailModal
        isOpen={modalOpen}
        enquiry={selectedEnquiry}
        onClose={() => setModalOpen(false)}
        onUpdated={() => {
          showNotification('Enquiry records updated.');
          fetchEnquiries();
        }}
      />
    </AdminLayout>
  );
};
