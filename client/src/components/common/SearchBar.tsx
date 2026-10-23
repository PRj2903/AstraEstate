import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, RotateCcw } from 'lucide-react';
import type { ListingType } from '../../types';
import { api } from '../../services/api';

interface SearchBarProps {
  initialSearch?: string;
  initialListingType?: ListingType | '';
  initialCity?: string;
  initialMinPrice?: string | number;
  initialMaxPrice?: string | number;
  onFilterChange?: (filters: any) => void;
  compact?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialSearch = '',
  initialListingType = '',
  initialCity = '',
  initialMinPrice = '',
  initialMaxPrice = '',
  onFilterChange,
  compact = false,
}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initialSearch);
  const [listingType, setListingType] = useState<ListingType | ''>(initialListingType);
  const [city, setCity] = useState(initialCity);
  const [minPrice, setMinPrice] = useState(initialMinPrice ? String(initialMinPrice) : '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice ? String(initialMaxPrice) : '');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    api.getLocations().then(setAvailableCities).catch(() => {});
  }, []);

  useEffect(() => {
    setSearch(initialSearch);
    setListingType(initialListingType);
    setCity(initialCity);
    setMinPrice(initialMinPrice ? String(initialMinPrice) : '');
    setMaxPrice(initialMaxPrice ? String(initialMaxPrice) : '');
  }, [initialSearch, initialListingType, initialCity, initialMinPrice, initialMaxPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (listingType) params.set('listingType', listingType);
    if (city) params.set('city', city);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);

    if (onFilterChange) {
      onFilterChange({
        search: search.trim(),
        listingType,
        city,
        minPrice,
        maxPrice,
      });
    } else {
      navigate(`/properties?${params.toString()}`);
    }
  };

  const handleClear = () => {
    setSearch('');
    setListingType('');
    setCity('');
    setMinPrice('');
    setMaxPrice('');

    if (onFilterChange) {
      onFilterChange({
        search: '',
        listingType: '',
        city: '',
        minPrice: '',
        maxPrice: '',
      });
    } else {
      navigate('/properties');
    }
  };

  const categories: { label: string; value: ListingType | '' }[] = [
    { label: 'All Estates', value: '' },
    { label: 'For Sale', value: 'BUY' },
    { label: 'To Rent', value: 'RENT' },
    { label: 'Commercial', value: 'COMMERCIAL' },
  ];

  return (
    <div className={`w-full ${compact ? '' : 'max-w-4xl mx-auto'}`}>
      {/* Category Tabs */}
      <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-1 scrollbar-none justify-center sm:justify-start">
        {categories.map((cat) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => setListingType(cat.value)}
            className={`px-5 py-2 text-xs tracking-wider uppercase font-semibold rounded-xl transition-all whitespace-nowrap shadow-sm ${
              listingType === cat.value
                ? 'bg-slate-900 text-[#e8d5a7] border border-[#c5a059]/50 shadow-md ring-1 ring-[#c5a059]/30'
                : 'bg-white/95 backdrop-blur-md text-slate-700 hover:text-slate-950 hover:bg-white border border-stone-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Filter Container */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/98 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xl space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword / Reference */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Location, neighborhood, or ref (AST-1001)..."
              className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
            />
          </div>

          {/* Location Selector */}
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9a7b38]" />
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-stone-50/80 border border-stone-200 rounded-xl pl-10 pr-8 py-3 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors appearance-none cursor-pointer"
            >
              <option value="">All Destinations</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-3 rounded-xl border transition-all text-xs flex items-center justify-center gap-1.5 ${
                showAdvanced
                  ? 'border-slate-900 text-slate-900 bg-stone-100'
                  : 'border-stone-200 text-slate-600 hover:bg-stone-50'
              }`}
              title="Price filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-5 rounded-xl bg-[#c5a059] hover:bg-[#b8934a] text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>

            {(search || listingType || city || minPrice || maxPrice) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-3 rounded-xl border border-stone-200 text-slate-400 hover:text-slate-800 hover:bg-stone-50 transition-all text-xs"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Price Range Filter */}
        {showAdvanced && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 select-none">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min Price (₹ e.g. 5 Cr = 50000000)"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 select-none">
                ₹
              </span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max Price (₹ e.g. 50 Cr = 500000000)"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
