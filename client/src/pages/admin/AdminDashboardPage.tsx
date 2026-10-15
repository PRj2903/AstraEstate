import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Inbox,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import type { DashboardMetrics } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getDashboardMetrics();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || 'Failed to aggregate dashboard records.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const getStatusBadge = (status: string) => {
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

  if (loading) {
    return (
      <AdminLayout pageTitle="Executive Dashboard">
        <LoadingSpinner message="Calculating database statistics..." />
      </AdminLayout>
    );
  }

  if (error || !metrics) {
    return (
      <AdminLayout pageTitle="Executive Dashboard">
        <div className="bg-white p-8 rounded-2xl border border-rose-200 text-rose-700 text-center space-y-3 shadow-xs">
          <ShieldAlert className="w-8 h-8 mx-auto" />
          <p className="text-sm">{error || 'Unable to load dashboard metrics'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-50 text-rose-900 rounded-lg text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { properties, enquiries, recentEnquiries } = metrics;

  return (
    <AdminLayout pageTitle="Executive Overview">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <h2 className="font-serif text-2xl text-slate-900">Live Portfolio Analytics</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time synchronization with database records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs tracking-wider uppercase hover:bg-slate-800 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Properties</span>
          </Link>
          <Link
            to="/admin/enquiries"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-slate-800 text-xs font-semibold tracking-wider uppercase transition-all"
          >
            <Inbox className="w-4 h-4 text-slate-600" />
            <span>Enquiries ({enquiries.pendingAction} Pending)</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Properties Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
              Total Estates
            </span>
            <div className="p-2 rounded-lg bg-stone-100 text-slate-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900">
            {properties.total}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-stone-100 font-medium">
            <span className="text-emerald-700 font-semibold">{properties.published} Published</span>
            <span>•</span>
            <span>{properties.draft} Drafts</span>
            <span>•</span>
            <span className="text-[#9a7b38]">{properties.featured} Featured</span>
          </div>
        </div>

        {/* Portfolio Valuation */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
              Published Asset Value
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              ₹
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900">
            ₹{(properties.totalPortfolioValue / 10_000_000).toFixed(1)} Cr
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-stone-100 font-medium">
            Active For Sale acquisition value (INR)
          </div>
        </div>

        {/* Total Enquiries */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
              Customer Enquiries
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900">
            {enquiries.total}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-stone-100 font-medium">
            <span className="text-amber-700 font-semibold">{enquiries.new} New Leads</span>
            <span>•</span>
            <span>{enquiries.inProgress} In Review</span>
          </div>
        </div>

        {/* Closed Deals / Success Rate */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
              Completed Actions
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900">
            {enquiries.closed}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-stone-100 font-medium">
            {enquiries.contacted} clients contacted
          </div>
        </div>
      </div>

      {/* Recent Enquiries Activity Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-slate-900">Recent Customer Enquiries</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live submissions from prospective clients.
            </p>
          </div>
          <Link
            to="/admin/enquiries"
            className="text-xs text-slate-900 hover:text-[#9a7b38] flex items-center gap-1 font-semibold"
          >
            <span>View All ({enquiries.total})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            No enquiry submissions recorded in database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-slate-600 uppercase tracking-wider text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ref #</th>
                  <th className="py-3 px-4 font-semibold">Client Name</th>
                  <th className="py-3 px-4 font-semibold">Associated Estate</th>
                  <th className="py-3 px-4 font-semibold">Channel</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Received</th>
                  <th className="py-3 px-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {enq.refNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-medium">
                      {enq.name}
                      <div className="text-[11px] text-slate-500">{enq.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {enq.property ? (
                        <span className="truncate max-w-[180px] block" title={enq.property.title}>
                          {enq.property.title}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">General Consultation</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-slate-700 border border-stone-200 font-semibold">
                        {enq.preferredContact}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border ${getStatusBadge(
                          enq.status
                        )}`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="/admin/enquiries"
                        className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 border border-stone-200 text-slate-800 text-[11px] font-medium"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
