import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@astreates.com');
  const [password, setPassword] = useState('AstrraAdmin2026!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@astreates.com');
    setPassword('AstrraAdmin2026!');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl tracking-[0.12em] font-semibold text-slate-900">
              ASTRRA
            </span>
            <span className="block text-[9px] tracking-[0.3em] text-[#9a7b38] uppercase font-bold mt-0.5">
              ESTATES • ADMIN ACCESS
            </span>
          </Link>
          <h1 className="font-serif text-2xl font-normal text-slate-900 pt-2">
            Administrator Authentication
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access property management and client enquiries.
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              Demo Credentials
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] text-amber-900 font-bold underline hover:text-slate-900"
            >
              Fill Credentials
            </button>
          </div>
          <div className="font-mono text-[11px] text-amber-950">
            Email: <span className="font-semibold">admin@astreates.com</span> <br />
            Password: <span className="font-semibold">AstrraAdmin2026!</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@astreates.com"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-700 mb-1.5 font-semibold">
                Security Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
            ← Return to Public Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
};
