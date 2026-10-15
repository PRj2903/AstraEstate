import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-slate-700 text-sm leading-relaxed">
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <span className="text-[10px] tracking-[0.2em] text-[#9a7b38] uppercase font-bold">
          Terms & Conditions
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal">
          Terms of Service & Demonstration Disclaimer
        </h1>
        <p className="text-xs text-slate-500">
          Applicable to all visitors and clients of Astrra Estates
        </p>
      </div>

      <div className="space-y-6">
        {/* Important Disclaimer Notice Box */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Fictional Demonstration Content Notice</span>
          </div>
          <p>
            This application is created as a complete full-stack real estate software platform for <strong>ASTRRA TECH</strong>. All listed properties, prices, imagery, descriptions, and customer enquiries are simulated demonstration artifacts designed to evaluate software engineering, database querying, validation, and security workflows.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">1. Property Descriptions & Accuracy</h2>
          <p>
            Photography, architectural renderings, square footages, and floor plans displayed on this platform are provided for illustrative purposes only. Prospective buyers must conduct independent surveys, legal title searches, and local planning inquiries prior to contracts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">2. Pricing & Currency</h2>
          <p>
            All listed prices are indicative guide values quoted in United States Dollars (USD) or local territory currency. Prices are subject to revision and formal vendor confirmation prior to binding legal contracts.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl text-slate-900">3. Intellectual Property Rights</h2>
          <p>
            The "Astrra Estates" trademark, visual brand identity, software architecture, and custom application code are proprietary intellectual property created for ASTRRA TECH.
          </p>
        </section>
      </div>
    </div>
  );
};
