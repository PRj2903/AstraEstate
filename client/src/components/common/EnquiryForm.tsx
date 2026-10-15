import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

interface EnquiryFormProps {
  propertyId?: string | null;
  propertyTitle?: string;
  propertyRef?: string;
  onSuccess?: () => void;
  className?: string;
}

export const EnquiryForm: React.FC<EnquiryFormProps> = ({
  propertyId = null,
  propertyTitle,
  propertyRef,
  onSuccess,
  className = '',
}) => {
  const { getWhatsAppUrl } = useSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'WHATSAPP' as 'EMAIL' | 'PHONE' | 'WHATSAPP',
    message: propertyTitle
      ? `I am interested in acquiring or arranging a private viewing of ${propertyTitle} (Ref: ${propertyRef}). Kindly forward the architectural dossier.`
      : 'I would like to schedule a private consultation with an Astrra Estates property advisor.',
  });

  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const whatsappMessage = propertyTitle
    ? `Hello Astrra Estates, I am inquiring regarding ${propertyTitle} (Ref: ${propertyRef}).`
    : 'Hello Astrra Estates, I would like to schedule a property consultation.';
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await api.submitEnquiry({
        propertyId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        preferredContact: formData.preferredContact,
        message: formData.message,
      });

      setSubmittedRef(res.data.refNumber);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      if (err.data && err.data.errors) {
        const errorsMap: Record<string, string> = {};
        err.data.errors.forEach((e: any) => {
          errorsMap[e.field] = e.message;
        });
        setFieldErrors(errorsMap);
      } else {
        setErrorMessage(err.message || 'Failed to submit enquiry. Please verify your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submittedRef) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-emerald-200 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-slate-900">
          Enquiry Received
        </h3>
        <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
          Your request has been registered under reference:
        </p>
        <div className="inline-block px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-mono text-base font-bold">
          {submittedRef}
        </div>
        <p className="text-xs text-slate-500">
          An Astrra Estates senior advisor will contact you shortly via your preferred channel.
        </p>

        <div className="pt-3 flex flex-col gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            Continue on WhatsApp
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmittedRef(null);
              setFormData({
                name: '',
                email: '',
                phone: '',
                preferredContact: 'WHATSAPP',
                message: '',
              });
            }}
            className="text-xs text-slate-500 hover:text-slate-800 underline pt-2"
          >
            Submit Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm ${className}`}>
      <div className="mb-6">
        <span className="text-[10px] tracking-[0.2em] text-[#9a7b38] uppercase font-bold">
          Confidential Dossier & Viewing
        </span>
        <h3 className="font-serif text-2xl font-medium text-slate-900 mt-0.5">
          Inquire with Concierge
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {propertyTitle ? `Inquiring for: ${propertyTitle}` : 'Connect with our private acquisitions team.'}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Eleanor Vance"
            className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors ${
              fieldErrors.name ? 'border-rose-400' : 'border-stone-200'
            }`}
          />
          {fieldErrors.name && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.name}</p>
          )}
        </div>

        {/* Email & Phone grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. eleanor@vance.com"
              className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors ${
                fieldErrors.email ? 'border-rose-400' : 'border-stone-200'
              }`}
            />
            {fieldErrors.email && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +44 20 7946 0912"
              className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors ${
                fieldErrors.phone ? 'border-rose-400' : 'border-stone-200'
              }`}
            />
            {fieldErrors.phone && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.phone}</p>
            )}
          </div>
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
            Preferred Communication Channel
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
              { id: 'EMAIL', label: 'Email', icon: Mail },
              { id: 'PHONE', label: 'Phone', icon: Phone },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = formData.preferredContact === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredContact: method.id as any })}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-stone-200 bg-stone-50 text-slate-600 hover:text-slate-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
            Your Message / Requirements *
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={`w-full bg-stone-50 border rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors ${
              fieldErrors.message ? 'border-rose-400' : 'border-stone-200'
            }`}
          />
          {fieldErrors.message && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Inquiry</span>
            </>
          )}
        </button>

        {/* WhatsApp Direct Option */}
        <div className="pt-2 text-center">
          <span className="text-[11px] text-slate-500">Need immediate answers? </span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold underline inline-flex items-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            Chat on WhatsApp
          </a>
        </div>
      </form>
    </div>
  );
};
