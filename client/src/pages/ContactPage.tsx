import React from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Shield } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { EnquiryForm } from '../components/common/EnquiryForm';

export const ContactPage: React.FC = () => {
  const { settings, getWhatsAppUrl } = useSettings();

  const phoneLink = `tel:${(settings.contact_phone || '+912269885000').replace(/\s+/g, '')}`;
  const emailLink = `mailto:${settings.contact_email || 'concierge@astreates.in'}`;
  const whatsappUrl = getWhatsAppUrl('Namaste Astrra Estates, I am contacting you for an introductory consultation.');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 pb-20">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.25em] text-[#9a7b38] uppercase font-bold">
          Concierge & Client Advisory
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-slate-900 font-normal">
          Get in Touch
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-normal max-w-xl mx-auto leading-relaxed">
          Contact our private wealth & property advisory desk for confidential acquisitions, bespoke mandates, or viewing appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.2em] text-[#9a7b38] uppercase font-bold">
                Instant Channels
              </span>
              <h3 className="font-serif text-2xl text-slate-900 font-normal mt-0.5">
                Direct Contact
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* WhatsApp Direct */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-all"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Direct WhatsApp Desk</div>
                  <div className="text-[11px] text-emerald-700">Fastest response for viewings & dossiers</div>
                </div>
              </a>

              {/* Telephone */}
              <a
                href={phoneLink}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-700 hover:bg-stone-100 transition-all"
              >
                <div className="p-2 rounded-lg bg-stone-200 text-slate-700">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Concierge Desk (India)</div>
                  <div className="text-[11px] text-slate-500">{settings.contact_phone || '+91 22 6988 5000'}</div>
                </div>
              </a>

              {/* Email */}
              <a
                href={emailLink}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-700 hover:bg-stone-100 transition-all"
              >
                <div className="p-2 rounded-lg bg-stone-200 text-slate-700">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Official Inquiries</div>
                  <div className="text-[11px] text-slate-500">{settings.contact_email || 'concierge@astreates.in'}</div>
                </div>
              </a>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">India Headquarters</div>
                  <div className="text-slate-500">{settings.office_address || 'Astrra Tower, Level 28, Bandra Kurla Complex (BKC), Mumbai 400051, India'}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Regional liaison desks: New Delhi NCR • Bengaluru • Goa • Hyderabad</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Operating Hours</div>
                  <div className="text-slate-500">{settings.office_hours || 'Mon - Sat: 9:30 AM - 7:30 PM IST'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900">Client Confidentiality</div>
                  <div className="text-slate-500">All submissions are protected under strict non-disclosure safeguards.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
};
