import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Footer: React.FC = () => {
  const { settings, getWhatsAppUrl } = useSettings();
  const currentYear = new Date().getFullYear();

  const whatsappUrl = getWhatsAppUrl('Namaste Astrra Estates, I am inquiring from your website.');
  const phoneLink = `tel:${(settings.contact_phone || '+912269885000').replace(/\s+/g, '')}`;
  const emailLink = `mailto:${settings.contact_email || 'concierge@astreates.in'}`;

  return (
    <footer className="bg-slate-900 text-slate-300 text-sm border-t border-slate-800">
      {/* Top Banner / Demonstration disclaimer banner */}
      <div className="bg-slate-950 border-b border-slate-800 py-2.5 px-4 text-center">
        <p className="text-xs text-slate-400">
          <strong className="text-stone-300">Demonstration Platform:</strong> Astrra Estates is a full-stack real estate platform engineered for <strong>ASTRRA TECH</strong>. All listed properties are fictional demonstration content.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.12em] font-semibold text-white">
                ASTRRA
              </span>
              <span className="block text-[10px] tracking-[0.25em] text-[#c2a265] uppercase font-semibold mt-0.5">
                ESTATES • PRIVATE CLIENT
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.tagline || 'Curators of Extraordinary Indian Architectural Living.'} Specializing in prime sea-facing penthouses, luxury villas, and landmark commercial headquarters across India.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60 text-xs font-medium tracking-wide transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp Direct
              </a>
              <a
                href={phoneLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium tracking-wide transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                Concierge Line
              </a>
            </div>
          </div>

          {/* Portfolio Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4">
              Properties
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=BUY" className="hover:text-white transition-colors">
                  Properties for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=RENT" className="hover:text-white transition-colors">
                  Private Leases & Rentals
                </Link>
              </li>
              <li>
                <Link to="/properties?listingType=COMMERCIAL" className="hover:text-white transition-colors">
                  Commercial & Prime Retail
                </Link>
              </li>
              <li>
                <Link to="/properties?isFeatured=true" className="hover:text-white transition-colors">
                  Featured Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Astrra Estates
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Concierge
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms & Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#c2a265] transition-colors flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Head Office Coordinates */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-white font-semibold mb-4">
              Offices
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c2a265] shrink-0 mt-0.5" />
                <span>{settings.office_address || 'Bandra Kurla Complex (BKC), Mumbai, India'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#c2a265] shrink-0" />
                <a href={phoneLink} className="hover:text-white transition-colors">
                  {settings.contact_phone || '+91 22 6988 5000'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#c2a265] shrink-0" />
                <a href={emailLink} className="hover:text-white transition-colors truncate">
                  {settings.contact_email || 'concierge@astreates.in'}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c2a265] shrink-0 mt-0.5" />
                <span>{settings.office_hours || 'Mon - Sat: 9:30 AM - 7:30 PM IST'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-slate-800 space-y-4">
          <div className="text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
            RERA Registered Real Estate Advisory Firm. All property transactions adhere to respective State Real Estate Regulatory Authorities (MahaRERA, HRERA, RERA Karnataka). Freehold titles and property documentation independently verified.
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {currentYear} Astrra Estates for ASTRRA TECH. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <Link to="/privacy" className="hover:text-slate-300">Privacy</Link>
              <Link to="/terms" className="hover:text-slate-300">Terms</Link>
              <Link to="/admin" className="hover:text-white">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
