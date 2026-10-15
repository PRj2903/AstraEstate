import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading properties...',
  className = 'py-20',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-stone-200 border-t-slate-800 animate-spin"></div>
      </div>
      {message && (
        <p className="mt-4 text-xs uppercase tracking-widest text-slate-500 font-medium">
          {message}
        </p>
      )}
    </div>
  );
};
