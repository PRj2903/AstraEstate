import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Phone, Menu, X, ArrowUpRight } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings, getWhatsAppUrl } = useSettings();
  const location = useLocation();

  const navLinks = [
    { label: 'All Properties', path: '/properties' },
    { label: 'Buy', path: '/properties?listingType=BUY' },
    { label: 'Rent', path: '/properties?listingType=RENT' },
    { label: 'Commercial', path: '/properties?listingType=COMMERCIAL' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const phoneLink = `tel:${(settings.contact_phone || '+912269885000').replace(/\s+/g, '')}`;
  const whatsappUrl = getWhatsAppUrl('Namaste Astrra Estates, I would like to enquire about your properties.');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col group items-start">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.12em] font-semibold text-slate-900 group-hover:text-[#c5a059] transition-colors">
              ASTRRA
            </span>
            <span className="text-[10px] tracking-[0.3em] text-[#c5a059] uppercase font-semibold -mt-1">
              ESTATES • PRIVATE CLIENT
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                link.path === '/properties'
                  ? location.pathname === '/properties' && !location.search
                  : `${location.pathname}${location.search}` === link.path ||
                    (link.path === '/about' && location.pathname === '/about') ||
                    (link.path === '/contact' && location.pathname === '/contact');

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`text-xs uppercase tracking-[0.15em] font-medium transition-all duration-200 relative py-2 ${
                    isActive
                      ? 'text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c5a059] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons & Direct Contacts */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Direct Phone */}
            <a
              href={phoneLink}
              title={`Call concierge: ${settings.contact_phone || '+91 22 6988 5000'}`}
              className="p-2.5 rounded-full border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>

            {/* Direct WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Chat on WhatsApp"
              className="p-2.5 rounded-full border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all text-xs flex items-center gap-1.5 bg-emerald-50/50"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>

            {/* Explore Button */}
            <Link
              to="/properties"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-all ml-1"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 rounded border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="grid grid-cols-1 gap-1 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm uppercase tracking-wider text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </a>
            <a
              href={phoneLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-wider font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg"
            >
              <Phone className="w-4 h-4" />
              Call Concierge: {settings.contact_phone || '+91 22 6988 5000'}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
