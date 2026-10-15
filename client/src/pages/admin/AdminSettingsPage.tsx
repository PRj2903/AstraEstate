import React, { useEffect, useState } from 'react';
import { Settings, Save, Check, AlertCircle, Phone, MessageSquare, Mail, MapPin, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useSettings } from '../../context/SettingsContext';

export const AdminSettingsPage: React.FC = () => {
  const { refreshSettings } = useSettings();

  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({
    company_name: '',
    tagline: '',
    contact_email: '',
    contact_phone: '',
    whatsapp_number: '',
    office_address: '',
    office_hours: '',
    whatsapp_template: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const items = await api.getAdminSettings();
        const map: Record<string, string> = {};
        items.forEach((item) => {
          map[item.key] = item.value;
        });
        setSettingsMap((prev) => ({ ...prev, ...map }));
      } catch (err: any) {
        setError(err.message || 'Failed to load business settings.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await api.updateAdminSettings(settingsMap);
      await refreshSettings();
      setSuccessMsg('Business contact details and site configurations successfully updated in database.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout pageTitle="Business Configuration">
      <div className="max-w-4xl space-y-6">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-2">
          <h2 className="font-serif text-2xl text-slate-900">Global Business & Contact Settings</h2>
          <p className="text-xs text-slate-500">
            Changes saved here immediately update customer touchpoints, header phone lines, footer metadata, and automated WhatsApp prefill templates across the platform.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <LoadingSpinner message="Retrieving configuration records..." />
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6 text-xs">
            {/* Branding Identity */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-stone-200 pb-2">
                Brand & Tagline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Trading Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsMap.company_name}
                    onChange={(e) => setSettingsMap({ ...settingsMap, company_name: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settingsMap.tagline}
                    onChange={(e) => setSettingsMap({ ...settingsMap, tagline: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Default Display Currency
                  </label>
                  <select
                    value={settingsMap.currency_symbol || '₹'}
                    onChange={(e) => setSettingsMap({ ...settingsMap, currency_symbol: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900 cursor-pointer"
                  >
                    <option value="₹">₹ - Indian Rupee (INR)</option>
                    <option value="$">$ - US Dollar (USD)</option>
                    <option value="€">€ - Euro (EUR)</option>
                    <option value="£">£ - British Pound (GBP)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-stone-200 pb-2">
                Direct Client Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Concierge Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={settingsMap.contact_phone}
                      onChange={(e) => setSettingsMap({ ...settingsMap, contact_phone: e.target.value })}
                      placeholder="+91 22 6988 5000"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    WhatsApp Concierge Line
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                    <input
                      type="text"
                      required
                      value={settingsMap.whatsapp_number}
                      onChange={(e) => setSettingsMap({ ...settingsMap, whatsapp_number: e.target.value })}
                      placeholder="+919820012345"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Customer Support Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={settingsMap.contact_email}
                      onChange={(e) => setSettingsMap({ ...settingsMap, contact_email: e.target.value })}
                      placeholder="concierge@astreates.in"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Office Coordinates */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-stone-200 pb-2">
                Office Coordinates & Operating Hours
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Headquarters Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={settingsMap.office_address}
                      onChange={(e) => setSettingsMap({ ...settingsMap, office_address: e.target.value })}
                      placeholder="Astrra Tower, BKC, Mumbai 400051, India"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                    Desk Operating Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={settingsMap.office_hours}
                      onChange={(e) => setSettingsMap({ ...settingsMap, office_hours: e.target.value })}
                      placeholder="Monday - Saturday: 9:30 AM - 7:30 PM IST"
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Automated Template */}
            <div className="space-y-2">
              <label className="block text-slate-700 uppercase tracking-wider mb-1 font-medium">
                WhatsApp Prefilled Message Template
              </label>
              <textarea
                rows={3}
                value={settingsMap.whatsapp_template}
                onChange={(e) => setSettingsMap({ ...settingsMap, whatsapp_template: e.target.value })}
                placeholder="Use {title} and {refNumber} placeholders..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-4 py-2.5 text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
              />
              <p className="text-[11px] text-slate-500">
                Placeholders available: <code className="text-slate-900 font-semibold">{`{title}`}</code> and <code className="text-slate-900 font-semibold">{`{refNumber}`}</code>
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-medium uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-slate-800 shadow disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Business Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};
