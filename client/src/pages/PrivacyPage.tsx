import React from 'react';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-slate-700 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <span className="text-[10px] tracking-[0.2em] text-[#9a7b38] uppercase font-bold">
          Institutional Confidentiality
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500">
          Last revised: October 2026 • Astrra Estates for ASTRRA TECH
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">1. Commitment to Client Privacy</h2>
          <p>
            Astrra Estates ("we", "us", "our") is dedicated to protecting your privacy. We process client information, viewing appointments, and communications under strict confidentiality protocols.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">2. Information Collection</h2>
          <p>
            We collect information provided directly through our secure enquiry and viewing forms:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs pl-2">
            <li>Full Name and representation details</li>
            <li>Contact coordinates including verified email address and telephone/WhatsApp number</li>
            <li>Preferred communication channels and appointment schedules</li>
            <li>Specific acquisition requirements and architectural preferences</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">3. Purpose and Legal Basis</h2>
          <p>
            Your information is utilized solely to facilitate property viewing coordinates, dispatch architectural dossiers, and assist in legal conveyancing coordination.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">4. Non-Disclosure to Third Parties</h2>
          <p>
            We never sell, lease, or monetize client data. Information is disclosed only to verified escrow agents, licensed conveyancers, or regulatory authorities when mandated by law.
          </p>
        </section>
      </div>
    </div>
  );
};
