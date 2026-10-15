import React from 'react';
import { Moon, Sparkles, Gem, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false, className = '' }) => {
  const { isObsidian, toggleTheme, themeName } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      id="theme-toggle-btn"
      title={`Switch to ${isObsidian ? 'Royal Ivory & Emerald Heritage' : 'Obsidian Nocturne & Gold'} aesthetic`}
      aria-label={`Current aesthetic: ${themeName}. Click to toggle design theme.`}
      className={`group relative inline-flex items-center gap-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c5a059]/40 ${
        isObsidian
          ? 'bg-[#182338] hover:bg-[#202e49] text-[#e2c77d] border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
          : 'bg-[#f4eee4] hover:bg-[#eae1d2] text-[#0c382e] border border-[#c5a059]/50 shadow-xs'
      } ${compact ? 'p-2' : 'px-3.5 py-1.5'} ${className}`}
    >
      <span className="relative flex items-center justify-center">
        {isObsidian ? (
          <Moon className="w-3.5 h-3.5 text-[#f3c853] transition-transform duration-300 group-hover:-rotate-12" />
        ) : (
          <Gem className="w-3.5 h-3.5 text-[#0c382e] transition-transform duration-300 group-hover:scale-110" />
        )}
      </span>

      {!compact && (
        <span className="text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap">
          {isObsidian ? 'Obsidian Gold' : 'Royal Ivory'}
        </span>
      )}

      {/* Subtle indicator dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isObsidian ? 'bg-[#d4af37] animate-pulse' : 'bg-[#0c382e]'
        }`}
      />
    </button>
  );
};
