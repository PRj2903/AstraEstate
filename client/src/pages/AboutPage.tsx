import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Compass, Shield, Users, ArrowUpRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 py-10 pb-20">
      {/* Editorial Header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-slate-800 text-[10px] tracking-widest uppercase font-semibold">
          About Astrra Estates • India
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-slate-900 font-normal leading-tight">
          Where Architectural Vision <br />
          Meets Private Stewardship.
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 font-light leading-relaxed">
          Founded on discretion, architectural pedigree, and nationwide reach, Astrra Estates is India's premier luxury real estate advisory firm built for visionary industrial leaders, private family offices, NRI investors, and discerning connoisseurs of elevated living.
        </p>
      </section>

      {/* Narrative Section with Image */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/3] border border-stone-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
              alt="Astrra Estates Architecture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-[10px] tracking-widest uppercase text-[#c2a265] font-semibold">
                Our Standard
              </span>
              <p className="font-serif text-xl mt-1">
                "We do not merely broker real estate. We represent monuments of enduring architectural distinction across India."
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5 text-sm text-slate-700 leading-relaxed font-normal">
            <h2 className="font-serif text-3xl text-slate-900 font-normal">
              An Elevated Standard in Indian Property Advisory
            </h2>
            <p>
              Under the technology stewardship of <strong>ASTRRA TECH</strong>, Astrra Estates was founded to bring clarity, institutional transparency, and high-performance digital tools to private luxury property transactions across the subcontinent.
            </p>
            <p>
              In gateway Indian centers — Mumbai's sea-facing corridors, New Delhi's Lutyens' Bungalow Zone & DLF Golf Links, Bengaluru's verdant avenues, Goa's private coastal sanctuaries, and Hyderabad's Jubilee Hills — extraordinary residential estates and Grade-A commercial assets demand deep market intelligence, confidentiality, RERA due diligence, and bespoke conveyance coordination.
            </p>
            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-stone-200">
              <div>
                <div className="font-serif text-3xl font-bold text-slate-900">100%</div>
                <div className="text-xs text-slate-500 mt-1">RERA & Title Due Diligence</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-slate-900">₹2,500+ Cr</div>
                <div className="text-xs text-slate-500 mt-1">Curated Indian Portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Tenets */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a7b38] font-bold">
              Core Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal mt-1">
              The Four Pillars of Astrra
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Shield className="w-5 h-5 text-slate-800" />
              <h3 className="font-serif text-lg text-slate-900 font-medium">Bespoke Discretion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete client privacy. Off-market mandates, NDAs, and transactional confidentiality guarded for India's foremost business families and private clients.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Award className="w-5 h-5 text-slate-800" />
              <h3 className="font-serif text-lg text-slate-900 font-medium">Architectural Provenance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We represent structures conceived by master architects, renowned craftsmen, heritage restorers, and Vastu-aligned residential sanctuaries.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Compass className="w-5 h-5 text-slate-800" />
              <h3 className="font-serif text-lg text-slate-900 font-medium">RERA & Title Assurance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct legal due diligence on 30-year freehold titles, encumbrance verification, state RERA compliance, and streamlined registry orchestration.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <Users className="w-5 h-5 text-slate-800" />
              <h3 className="font-serif text-lg text-slate-900 font-medium">Family Office Concierge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                White-glove advisory from private jet viewings to turnkey registration, interior curation, NRI repatriation assistance, and ongoing asset stewardship.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-5">
        <h2 className="font-serif text-3xl sm:text-4xl text-slate-900">
          Begin Your Private Consultation
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Contact our senior acquisitions desk in Mumbai, New Delhi NCR, Bengaluru, or Goa to discuss your property mandate or schedule a confidential viewing.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold text-xs tracking-wider uppercase hover:bg-slate-800 transition-all shadow-sm"
          >
            <span>Speak with Concierge</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
