import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Building2,
  Layers,
} from 'lucide-react';
import { Property, ListingType, PropertyStatus, PaginationMeta } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { PropertyFormModal } from '../../components/admin/PropertyFormModal';
import { useSettings } from '../../context/SettingsContext';

export const AdminPropertiesPage: React.FC = () => {
  const { formatPrice } = useSettings();
  const [properties, setProperties] = useState<Property[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getAdminProperties({
        search,
        status: statusFilter,
        listingType: typeFilter,
        page,
        limit: 12,
      });
      setProperties(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, typeFilter, page]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleToggleStatus = async (prop: Property) => {
    const nextStatus = prop.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.updateAdminPropertyStatus(prop.id, nextStatus);
      showNotification(`Estate ${prop.refNumber} status updated to ${nextStatus}.`);
      fetchProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleToggleFeatured = async (prop: Property) => {
    try {
      await api.toggleAdminPropertyFeatured(prop.id, !prop.isFeatured);
      showNotification(`Estate ${prop.refNumber} featured status toggled.`);
      fetchProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle featured status');
    }
  };

  const handleDelete = async (prop: Property) => {
    if (window.confirm(`Are you certain you wish to delete listing '${prop.title}' (${prop.refNumber})? This action removes associated images and records.`)) {
      try {
        await api.deleteAdminProperty(prop.id);
        showNotification(`Estate ${prop.refNumber} deleted.`);
        fetchProperties();
      } catch (err: any) {
        alert(err.message || 'Failed to delete property');
      }
    }
  };

  const handleOpenCreate = () => {
    setSelectedProperty(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setSelectedProperty(prop);
    setModalOpen(true);
  };

  return (
    <AdminLayout pageTitle="Estate Inventory Management">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed top-20 right-8 z-50 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-lg flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl text-slate-900">Property Listings Directory</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, edit, toggle visibility, and update pricing across all sectors.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-xs tracking-wider uppercase hover:bg-slate-800 shadow transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Estate</span>
          </button>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-3 border-t border-stone-100">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference, title, or address..."
              className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            >
              <option value="ALL">All Publication Statuses</option>
              <option value="PUBLISHED">Published Only</option>
              <option value="DRAFT">Draft Only</option>
              <option value="ARCHIVED">Archived Only</option>
            </select>
          </div>

          {/* Sector Filter */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
            >
              <option value="">All Sectors (Buy, Rent, Comm)</option>
              <option value="BUY">For Sale (BUY)</option>
              <option value="RENT">To Rent (RENT)</option>
              <option value="COMMERCIAL">Commercial (COMMERCIAL)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div>
            Total Inventory: <span className="text-slate-900 font-semibold">{meta.total}</span> listings
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Querying active inventory records..." />
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-xs">{error}</div>
        ) : properties.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-serif text-2xl text-slate-900">No Properties Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no properties matching your active filters. Try adjusting your query or create a new property listing.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-slate-800"
            >
              Create First Listing
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fa] text-slate-500 uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Ref #</th>
                  <th className="py-3 px-4">Estate Title</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-stone-50/70 transition-colors">
                    {/* Ref Number */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                      {prop.refNumber}
                    </td>

                    {/* Title with image thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prop.images?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="w-10 h-8 rounded object-cover bg-stone-100 border border-stone-200"
                        />
                        <div className="truncate max-w-[220px]">
                          <div className="font-medium text-slate-900 truncate" title={prop.title}>
                            {prop.title}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {prop.bedrooms > 0 ? `${prop.bedrooms} Bed • ` : ''}
                            {prop.areaSqFt.toLocaleString()} sq ft
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Classification */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-stone-100 border border-stone-200 text-slate-700">
                        {prop.listingType}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {formatPrice(prop.price, prop.currency, null, prop.priceSuffix)}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600">
                      {prop.city}, {prop.country}
                    </td>

                    {/* Status Pill with toggle click */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(prop)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase border transition-all ${
                          prop.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : prop.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {prop.status}
                      </button>
                    </td>

                    {/* Featured Star */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prop)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          prop.isFeatured
                            ? 'bg-amber-50 border-amber-300 text-amber-600'
                            : 'bg-stone-50 border-stone-200 text-slate-400 hover:text-slate-700'
                        }`}
                        title="Toggle Featured on Homepage"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <Link
                        to={`/properties/${prop.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-slate-900 inline-block transition-colors"
                        title="Preview Public Listing"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-slate-900 inline-block transition-colors"
                        title="Edit Property"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(prop)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 inline-block transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && !loading && (
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              Page {meta.page} of {meta.totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-stone-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="p-2 rounded-lg border border-stone-200 bg-white text-slate-600 hover:text-slate-900 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Form Modal (Add / Edit) */}
      <PropertyFormModal
        isOpen={modalOpen}
        property={selectedProperty}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          showNotification(selectedProperty ? 'Property updated successfully.' : 'New property created.');
          fetchProperties();
        }}
      />
    </AdminLayout>
  );
};
