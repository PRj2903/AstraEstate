import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-700">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs tracking-[0.25em] uppercase text-slate-500 font-semibold">
            Error 404 • Page Not Found
          </div>
          <h1 className="font-serif text-4xl text-slate-900 font-normal">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-light leading-relaxed">
            The page or property dossier you are attempting to access does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>

          <Link
            to="/properties"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white border border-stone-200 text-slate-800 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
