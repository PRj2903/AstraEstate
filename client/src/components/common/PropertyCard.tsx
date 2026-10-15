import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, MessageSquare, ArrowUpRight } from 'lucide-react';
import type { Property } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className = '' }) => {
  const { formatPrice, getWhatsAppUrl } = useSettings();

  const primaryImage =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const formattedPrice = formatPrice(
    property.price,
    property.currency,
    property.pricePrefix,
    property.priceSuffix
  );

  const whatsappMessage = `Hello Astrra Estates, I am inquiring about ${property.title} (Ref: ${property.refNumber}). Please provide further details.`;
  const whatsappLink = getWhatsAppUrl(whatsappMessage);

  const getListingTypeLabel = () => {
    switch (property.listingType) {
      case 'BUY':
        return 'For Sale';
      case 'RENT':
        return 'For Rent';
      case 'COMMERCIAL':
        return 'Commercial';
      default:
        return property.listingType;
    }
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-stone-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${className}`}
    >
      {/* Image Container */}
      <Link
        to={`/properties/${property.slug}`}
        className="relative block w-full aspect-[16/10] overflow-hidden bg-stone-100"
      >
        <img
          src={primaryImage}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Badges on top of image */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2 items-center">
          <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md bg-white/95 text-slate-800 shadow-sm border border-stone-100 backdrop-blur-xs">
            {getListingTypeLabel()}
          </span>
          {property.isFeatured && (
            <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md bg-[#9a7b38] text-white shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Reference tag */}
        <div className="absolute top-3.5 right-3.5">
          <span className="px-2.5 py-1 text-[10px] font-mono tracking-wider rounded-md bg-slate-900/75 text-white backdrop-blur-xs">
            {property.refNumber}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        {/* Price & Location */}
        <div>
          <div className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            {formattedPrice}
          </div>
          <div className="flex items-center text-xs text-slate-500 gap-1.5 font-medium mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#9a7b38] shrink-0" />
            <span className="truncate">
              {property.locality ? `${property.locality}, ` : ''}{property.city}, {property.country}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/properties/${property.slug}`} className="block">
          <h3 className="font-serif text-lg font-medium text-slate-800 group-hover:text-[#9a7b38] transition-colors line-clamp-1">
            {property.title}
          </h3>
        </Link>

        {/* Tagline or snippet */}
        {property.tagline && (
          <p className="text-xs text-slate-500 line-clamp-1 italic font-light">
            {property.tagline}
          </p>
        )}

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-xs text-slate-600 font-medium">
          {property.bedrooms > 0 ? (
            <div className="flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">
                {property.propertyType.replace(/_/g, ' ')}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-400" />
            <span>{property.bathrooms} Baths</span>
          </div>

          <div className="flex items-center gap-1.5 justify-end">
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span>{property.areaSqFt.toLocaleString()} sq ft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            title="Chat on WhatsApp"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          <Link
            to={`/properties/${property.slug}`}
            className="flex items-center gap-1 text-xs font-semibold tracking-wider uppercase text-slate-900 hover:text-[#9a7b38] transition-colors"
          >
            <span>View Estate</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9a7b38] transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};
