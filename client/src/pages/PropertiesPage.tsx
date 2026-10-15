import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  ChevronLeft,
  ChevronRight,
  FilterX,
  Layers,
} from 'lucide-react';
import type { Property, ListingType, PaginationMeta } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract query filters from URL
  const search = searchParams.get('search') || '';
  const listingType = (searchParams.get('listingType') || '') as ListingType | '';
  const propertyType = searchParams.get('propertyType') || '';
  const city = searchParams.get('city') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const bedrooms = searchParams.get('bedrooms') || '';
  const bathrooms = searchParams.get('bathrooms') || '';
  const isFeatured = searchParams.get('isFeatured') === 'true';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch available locations
  useEffect(() => {
    api.getLocations().then(setAvailableCities).catch(() => {});
  }, []);

  // Update query params helper
  const updateParams = useCallback((newParams: Record<string, string | null>) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(newParams).forEach(([k, v]) => {
        if (v === null || v === '') {
          next.delete(k);
        } else {
          next.set(k, v);
        }
      });
      return next;
    });
  }, [setSearchParams]);

  // Load properties whenever search params change
  useEffect(() => {
    let isMounted = true;
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.getProperties({
          search,
          listingType,
          propertyType,
          city,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          bedrooms: bedrooms ? Number(bedrooms) : undefined,
          bathrooms: bathrooms ? Number(bathrooms) : undefined,
          isFeatured: isFeatured ? true : undefined,
          sortBy: sortBy as any,
          page,
          limit: 9,
        });

        if (isMounted) {
          setProperties(res.data);
          setMeta(res.meta);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to retrieve property listings.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperties();
    return () => {
      isMounted = false;
    };
  }, [search, listingType, propertyType, city, minPrice, maxPrice, bedrooms, bathrooms, isFeatured, sortBy, page]);

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    search || listingType || propertyType || city || minPrice || maxPrice || bedrooms || bathrooms || isFeatured
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-stone-200 pb-6">
        <span className="text-[10px] tracking-[0.25em] text-[#9a7b38] uppercase font-bold">
          Portfolio Directory
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-slate-900">
          {listingType === 'BUY'
            ? 'Properties for Sale'
            : listingType === 'RENT'
            ? 'Luxury Residences for Rent'
            : listingType === 'COMMERCIAL'
            ? 'Commercial & Retail Estates'
            : 'Exclusive Indian & Luxury Estates'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-light">
          Discover vetted residential and commercial properties across prime Indian metropolises and coastal retreats.
        </p>
      </div>

      {/* Main Top Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => updateParams({ search: e.target.value, page: '1' })}
              placeholder="Search keyword, location, or reference (e.g. AST-1001)..."
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          {/* Quick Listing Type Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { label: 'All', value: '' },
              { label: 'Buy', value: 'BUY' },
              { label: 'Rent', value: 'RENT' },
              { label: 'Commercial', value: 'COMMERCIAL' },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => updateParams({ listingType: tab.value, page: '1' })}
                className={`px-3 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all whitespace-nowrap ${
                  listingType === tab.value
                    ? 'bg-slate-900 text-white'
                    : 'bg-stone-50 text-slate-600 hover:text-slate-900 border border-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => updateParams({ sortBy: e.target.value, page: '1' })}
              className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="area-desc">Area: Largest Sq Ft</option>
            </select>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-slate-700"
              title="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Detailed Filters Row */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-stone-100 ${
            showMobileFilters ? 'block' : 'hidden lg:grid'
          }`}
        >
          {/* City */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-slate-500 mb-1 font-semibold">
              Location / City
            </label>
            <select
              value={city}
              onChange={(e) => updateParams({ city: e.target.value, page: '1' })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900"
            >
              <option value="">All Destinations</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-slate-500 mb-1 font-semibold">
              Min Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 5 Cr (50000000)"
              value={minPrice}
              onChange={(e) => updateParams({ minPrice: e.target.value, page: '1' })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-slate-500 mb-1 font-semibold">
              Max Price (₹)
            </label>
            <input
              type="number"
              placeholder="e.g. 50 Cr (500000000)"
              value={maxPrice}
              onChange={(e) => updateParams({ maxPrice: e.target.value, page: '1' })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[10px] tracking-wider uppercase text-slate-500 mb-1 font-semibold">
              Bedrooms
            </label>
            <select
              value={bedrooms}
              onChange={(e) => updateParams({ bedrooms: e.target.value, page: '1' })}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900"
            >
              <option value="">Any</option>
              <option value="1">1+ Bedrooms</option>
              <option value="2">2+ Bedrooms</option>
              <option value="3">3+ Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
              <option value="5">5+ Bedrooms</option>
            </select>
          </div>

          {/* Featured / Reset Action */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => updateParams({ isFeatured: isFeatured ? null : 'true', page: '1' })}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                isFeatured
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-stone-200 bg-stone-50 text-slate-700 hover:bg-stone-100'
              }`}
            >
              Featured Only
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="p-2 rounded-lg border border-stone-200 bg-stone-50 text-slate-500 hover:text-slate-900 hover:bg-stone-100 transition-all text-xs"
                title="Reset all filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 border-b border-stone-200 pb-3">
        <div>
          Showing <span className="font-semibold text-slate-900">{properties.length}</span> of{' '}
          <span className="font-semibold text-slate-900">{meta.total}</span> properties
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-slate-700 hover:text-slate-900 underline flex items-center gap-1 font-semibold"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Properties Grid / States */}
      {loading ? (
        <LoadingSpinner message="Filtering properties..." />
      ) : error ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-rose-200 text-rose-700 space-y-3 shadow-xs">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-50 text-rose-800 rounded-lg text-xs font-semibold"
          >
            Retry Request
          </button>
        </div>
      ) : properties.length === 0 ? (
        /* Empty State */
        <div className="bg-white p-16 text-center rounded-2xl border border-stone-200 max-w-xl mx-auto space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-slate-400">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl text-slate-900">No Matching Properties</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            We could not find any active listings matching your criteria. Try widening your price range or resetting filters.
          </p>
          <div className="pt-2">
            <button
              onClick={clearAllFilters}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold tracking-wider uppercase hover:bg-slate-800 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        /* Properties Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {meta.totalPages > 1 && !loading && (
        <div className="pt-8 flex items-center justify-center space-x-2">
          <button
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={page <= 1}
            className="p-2.5 rounded-lg border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => updateParams({ page: String(p) })}
              className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${
                page === p
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-slate-700 hover:bg-stone-50'
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={page >= meta.totalPages}
            className="p-2.5 rounded-lg border border-stone-200 bg-white text-slate-700 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
