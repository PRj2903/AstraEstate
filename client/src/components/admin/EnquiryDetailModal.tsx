import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Phone,
  MessageSquare,
  Building2,
  ExternalLink,
  Save,
  Check,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { Enquiry, EnquiryStatus } from '../../types';
import { api } from '../../services/api';

interface EnquiryDetailModalProps {
  enquiry: Enquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

export const EnquiryDetailModal: React.FC<EnquiryDetailModalProps> = ({
  enquiry,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [status, setStatus] = useState<EnquiryStatus>('NEW');
  const [internalNotes, setInternalNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (enquiry) {
      setStatus(enquiry.status);
      setInternalNotes(enquiry.internalNotes || '');
      setSuccessMsg(null);
      setError(null);
    }
  }, [enquiry, isOpen]);

  if (!isOpen || !enquiry) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await api.updateAdminEnquiry(enquiry.id, {
        status,
        internalNotes: internalNotes.trim() ? internalNotes.trim() : '',
      });

      setSuccessMsg('Enquiry status and internal notes saved.');
      onUpdated();
      setTimeout(() => setSuccessMsg(null), 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to update enquiry record.');
    } finally {
      setLoading(false);
    }
  };

  const clientPhoneClean = enquiry.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${clientPhoneClean}?text=${encodeURIComponent(
    `Hello ${enquiry.name}, thank you for contacting Astrra Estates regarding enquiry ${enquiry.refNumber}.`
  )}`;
  const phoneLink = `tel:${clientPhoneClean}`;
  const emailLink = `mailto:${enquiry.email}?subject=${encodeURIComponent(
    `Astrra Estates Inquiry Ref: ${enquiry.refNumber}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-stone-200 rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 shrink-0 bg-stone-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-900">
                {enquiry.refNumber}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-100 text-slate-700 border border-stone-200">
                {enquiry.preferredContact}
              </span>
            </div>
            <h3 className="font-serif text-2xl text-slate-900 mt-1">
              {enquiry.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 text-xs overflow-y-auto max-h-[75vh]">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Client Actions */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>

            <a
              href={phoneLink}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-700 hover:text-slate-900 hover:bg-stone-100 font-semibold transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-600" />
              <span>Call</span>
            </a>

            <a
              href={emailLink}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-700 hover:text-slate-900 hover:bg-stone-100 font-semibold transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Email</span>
            </a>
          </div>

          {/* Contact Details Card */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Email</span>
                <div className="font-medium text-slate-900">{enquiry.email}</div>
              </div>
              <div>
                <span className="text-slate-400 uppercase tracking-wider text-[10px]">Telephone</span>
                <div className="font-medium text-slate-900">{enquiry.phone}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-slate-500">
              <span>Submitted On</span>
              <span className="text-slate-900 font-medium">{new Date(enquiry.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Associated Estate */}
          {enquiry.property ? (
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
              <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
                Associated Property Interest
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-serif text-base font-semibold text-slate-900">
                    {enquiry.property.title}
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Ref: {enquiry.property.refNumber} • {enquiry.property.city}
                  </div>
                </div>

                {enquiry.property.slug && (
                  <a
                    href={`/properties/${enquiry.property.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-white hover:bg-stone-100 text-slate-700 border border-stone-200"
                    title="View Property Dossier"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 text-slate-500 italic">
              General Private Client Concierge Request (Not tied to a single estate).
            </div>
          )}

          {/* Customer Message */}
          <div className="space-y-1.5">
            <label className="text-slate-500 uppercase tracking-wider text-[10px] font-medium">
              Client Message / Request
            </label>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
              {enquiry.message}
            </div>
          </div>

          {/* Admin Management: Status & Private Internal Notes */}
          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-stone-200">
            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5 font-medium">
                Enquiry Status Workflow
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-white border border-stone-300 rounded-lg px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="NEW">NEW (Unopened Lead)</option>
                <option value="CONTACTED">CONTACTED (Follow-up Dispatched)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Viewing / Legal In Process)</option>
                <option value="CLOSED">CLOSED (Completed / Archived)</option>
                <option value="SPAM">SPAM (Flagged Bot Submission)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1.5 font-medium">
                Private Internal Notes (Never exposed to public)
              </label>
              <textarea
                rows={4}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Record private advisor notes, client net worth verification, scheduled viewing times, legal counsel details..."
                className="w-full bg-white border border-stone-300 rounded-lg px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-stone-300 text-slate-700 hover:text-slate-900 uppercase tracking-wider font-semibold text-xs"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white font-medium uppercase tracking-wider text-xs flex items-center gap-1.5 hover:bg-slate-800 shadow disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Status & Notes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
