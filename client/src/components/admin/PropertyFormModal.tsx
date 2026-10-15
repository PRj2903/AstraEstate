import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';
import type { Property, ListingType, PropertyStatus } from '../../types';
import { api } from '../../services/api';

interface PropertyFormModalProps {
  property?: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  property,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const isEditing = Boolean(property);

  const [formData, setFormData] = useState({
    refNumber: '',
    title: '',
    slug: '',
    tagline: '',
    description: '',
    listingType: 'BUY' as ListingType,
    propertyType: 'VILLA',
    status: 'PUBLISHED' as PropertyStatus,
    isFeatured: false,
    price: 35000000,
    currency: 'INR',
    pricePrefix: 'Guide Price',
    priceSuffix: '',
    bedrooms: 4,
    bathrooms: 4.5,
    areaSqFt: 5500,
    yearBuilt: 2024,
    furnishing: 'Designer Turnkey',
    parkingSpaces: 3,
    address: '',
    locality: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '',
    amenities: ['Vastu Compliant', '100% Power Backup', 'Staff Quarters', 'Private Elevator'] as string[],
    newAmenityInput: '',
    images: [] as { url: string; altText: string; isPrimary: boolean; displayOrder: number }[],
    newImageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (property) {
      setFormData({
        refNumber: property.refNumber,
        title: property.title,
        slug: property.slug,
        tagline: property.tagline || '',
        description: property.description,
        listingType: property.listingType,
        propertyType: property.propertyType,
        status: property.status,
        isFeatured: property.isFeatured,
        price: property.price,
        currency: property.currency,
        pricePrefix: property.pricePrefix || '',
        priceSuffix: property.priceSuffix || '',
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        areaSqFt: property.areaSqFt,
        yearBuilt: property.yearBuilt || 2023,
        furnishing: property.furnishing || '',
        parkingSpaces: property.parkingSpaces || 2,
        address: property.address,
        locality: property.locality || '',
        city: property.city,
        state: property.state || '',
        country: property.country,
        postalCode: property.postalCode || '',
        amenities: property.amenities || [],
        newAmenityInput: '',
        images: property.images.map((img, idx) => ({
          url: img.url,
          altText: img.altText || property.title,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder || idx + 1,
        })),
        newImageUrl: '',
      });
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      setFormData({
        refNumber: `AST-${randomSuffix}`,
        title: '',
        slug: '',
        tagline: '',
        description: '',
        listingType: 'BUY',
        propertyType: 'VILLA',
        status: 'PUBLISHED',
        isFeatured: false,
        price: 35000000,
        currency: 'INR',
        pricePrefix: 'Guide Price',
        priceSuffix: '',
        bedrooms: 4,
        bathrooms: 4.5,
        areaSqFt: 5500,
        yearBuilt: 2024,
        furnishing: 'Designer Turnkey',
        parkingSpaces: 3,
        address: '',
        locality: '',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '',
        amenities: [
          'Vastu Compliant',
          'RERA Approved Title',
          '100% DG Power Backup',
          'Staff Quarters',
          'Private Elevator',
        ],
        newAmenityInput: '',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
            altText: 'Primary Elevation Gallery',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
        newImageUrl: '',
      });
    }
    setError(null);
  }, [property, isOpen]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const updates: any = { title: val };
      if (!isEditing || !prev.slug) {
        updates.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return { ...prev, ...updates };
    });
  };

  const handleAddAmenity = () => {
    if (!formData.newAmenityInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      amenities: [...prev.amenities, prev.newAmenityInput.trim()],
      newAmenityInput: '',
    }));
  };

  const handleRemoveAmenity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleAddImage = () => {
    if (!formData.newImageUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          url: prev.newImageUrl.trim(),
          altText: prev.title || 'Property Photo',
          isPrimary: prev.images.length === 0,
          displayOrder: prev.images.length + 1,
        },
      ],
      newImageUrl: '',
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, images: filtered };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.images.length === 0) {
      setError('At least one property photo URL is required.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        refNumber: formData.refNumber,
        title: formData.title,
        slug: formData.slug,
        tagline: formData.tagline || null,
        description: formData.description,
        listingType: formData.listingType,
        propertyType: formData.propertyType,
        status: formData.status,
        isFeatured: formData.isFeatured,
        price: Number(formData.price),
        currency: formData.currency,
        pricePrefix: formData.pricePrefix || null,
        priceSuffix: formData.priceSuffix || null,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        areaSqFt: Number(formData.areaSqFt),
        yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : null,
        furnishing: formData.furnishing || null,
        parkingSpaces: formData.parkingSpaces ? Number(formData.parkingSpaces) : null,
        address: formData.address,
        locality: formData.locality || null,
        city: formData.city,
        state: formData.state || null,
        country: formData.country,
        postalCode: formData.postalCode || null,
        amenities: formData.amenities,
        images: formData.images,
      };

      if (isEditing && property) {
        await api.updateAdminProperty(property.id, payload);
      } else {
        await api.createAdminProperty(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      if (err.data && err.data.errors) {
        setError(err.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', '));
      } else {
        setError(err.message || 'Failed to save property listing.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white border border-stone-200 rounded-2xl shadow-xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 shrink-0">
          <div>
            <h3 className="font-serif text-2xl text-slate-900">
              {isEditing ? `Edit Property: ${property?.refNumber}` : 'Add New Property Listing'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates will persist directly to the database.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-800">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Identity */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-900 border-b border-stone-100 pb-2">
              1. Property Identification
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Ref Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.refNumber}
                  onChange={(e) => setFormData({ ...formData, refNumber: e.target.value })}
                  placeholder="e.g. AST-1020"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Listing Type *
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                >
                  <option value="BUY">BUY (For Sale)</option>
                  <option value="RENT">RENT (To Rent)</option>
                  <option value="COMMERCIAL">COMMERCIAL</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Property Classification *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                >
                  <option value="VILLA">VILLA</option>
                  <option value="PENTHOUSE">PENTHOUSE</option>
                  <option value="APARTMENT">APARTMENT</option>
                  <option value="ESTATE">ESTATE</option>
                  <option value="COMMERCIAL_OFFICE">COMMERCIAL OFFICE</option>
                  <option value="COMMERCIAL_RETAIL">COMMERCIAL RETAIL</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Aurelia Sky Penthouse"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. the-aurelia-sky-penthouse"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                Tagline / Subheadline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="e.g. Panoramic Arabian Gulf and skyline grandeur perched high above the Palm"
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed description of the property..."
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
              />
            </div>

            {/* Status & Featured */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Publication Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                >
                  <option value="PUBLISHED">PUBLISHED (Visible)</option>
                  <option value="DRAFT">DRAFT (Hidden)</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-800">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-stone-300"
                  />
                  <span className="font-semibold">Display in Homepage Featured Collection</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section: Financials & Specifications */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-900 border-b border-stone-100 pb-2">
              2. Financials & Physical Specifications
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Price (Numeric) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Currency
                </label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Price Prefix
                </label>
                <input
                  type="text"
                  value={formData.pricePrefix}
                  onChange={(e) => setFormData({ ...formData, pricePrefix: e.target.value })}
                  placeholder="e.g. Guide Price"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Price Suffix
                </label>
                <input
                  type="text"
                  value={formData.priceSuffix}
                  onChange={(e) => setFormData({ ...formData, priceSuffix: e.target.value })}
                  placeholder="e.g. / month"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Bathrooms
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Total Area (Sq Ft) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.areaSqFt}
                  onChange={(e) => setFormData({ ...formData, areaSqFt: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Parking Bays
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.parkingSpaces}
                  onChange={(e) => setFormData({ ...formData, parkingSpaces: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Year Built
                </label>
                <input
                  type="number"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: Number(e.target.value) })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Furnishing
                </label>
                <input
                  type="text"
                  value={formData.furnishing}
                  onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  placeholder="e.g. Turnkey Fitted"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-900 border-b border-stone-100 pb-2">
              3. Address & Location
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Worli Sea Face / Golf Course Road"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Mumbai, New Delhi, Bengaluru, Goa"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Locality / District
                </label>
                <input
                  type="text"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="e.g. Worli / DLF Phase 5 / Assagao"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Country *
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. India"
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 uppercase tracking-wider mb-1 font-semibold">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-900 border-b border-stone-100 pb-2">
              4. Features & Amenities
            </h4>

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newAmenityInput}
                onChange={(e) => setFormData({ ...formData, newAmenityInput: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAmenity();
                  }
                }}
                placeholder="Type an amenity and press Add..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-slate-800 border border-stone-200 rounded-lg font-semibold uppercase tracking-wider text-[11px]"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {formData.amenities.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-stone-100 border border-stone-200 text-slate-800 text-xs font-medium"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(idx)}
                    className="text-slate-400 hover:text-rose-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Section: Image Gallery Management */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-wider uppercase text-slate-900 border-b border-stone-100 pb-2">
              5. Image Gallery Management *
            </h4>

            <div className="flex gap-2">
              <input
                type="url"
                value={formData.newImageUrl}
                onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                placeholder="Paste high-res image URL (e.g. Unsplash)..."
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1 hover:bg-slate-800"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Photo</span>
              </button>
            </div>

            {/* Images List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`relative p-2 rounded-xl border bg-stone-50 space-y-2 ${
                    img.isPrimary ? 'border-slate-900 ring-1 ring-slate-900' : 'border-stone-200'
                  }`}
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-stone-200 relative">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {img.isPrimary && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-bold uppercase">
                        Primary Photo
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {!img.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryImage(idx)}
                        className="text-[11px] text-slate-700 hover:text-slate-900 font-semibold underline"
                      >
                        Set as Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="text-slate-400 hover:text-rose-600 ml-auto p-1"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Action Bar */}
          <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-slate-700 hover:bg-stone-50 text-xs font-semibold uppercase tracking-wider"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create Listing'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
