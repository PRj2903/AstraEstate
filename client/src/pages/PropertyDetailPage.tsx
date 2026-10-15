import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Shield,
  MessageSquare,
  Phone,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import type { Property } from '../types';
import { api } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { PropertyCard } from '../components/common/PropertyCard';
import { EnquiryForm } from '../components/common/EnquiryForm';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const { formatPrice, formatFullPrice, getWhatsAppUrl, settings } = useSettings();

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const res = await api.getPropertyBySlug(slug);
        if (isMounted) {
          setProperty(res.data);
          setRelated(res.related || []);
          setActiveImageIndex(0);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Estate dossier could not be located.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return <LoadingSpinner message="Opening property details..." className="min-h-[70vh]" />;
  }

  if (error || !property) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-slate-700">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl text-slate-900">Property Not Found</h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          The requested listing (Ref: {slug}) is currently unavailable or has been archived.
        </p>
        <div>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white text-xs font-semibold tracking-wider uppercase hover:bg-slate-800 transition-all"
          >
            Explore Active Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [
    { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80', isPrimary: true, displayOrder: 1, altText: property.title }
  ];

  const currentImage = images[activeImageIndex] || images[0];

  const formattedPrice = formatPrice(
    property.price,
    property.currency,
    property.pricePrefix,
    property.priceSuffix
  );

  const whatsappMessage = `Namaste Astrra Estates, I am inquiring regarding ${property.title} (Ref: ${property.refNumber}). Please provide further information.`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);
  const phoneLink = `tel:${(settings.contact_phone || '+912269885000').replace(/\s+/g, '')}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center space-x-2">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/properties" className="hover:text-slate-900 transition-colors">Properties</Link>
          <span>/</span>
          <Link to={`/properties?listingType=${property.listingType}`} className="hover:text-slate-900 transition-colors">
            {property.listingType === 'BUY' ? 'For Sale' : property.listingType === 'RENT' ? 'For Rent' : 'Commercial'}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px]">{property.title}</span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white text-slate-700 text-xs transition-all shadow-2xs"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied' : 'Share Property'}</span>
          </button>
        </div>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md bg-slate-900 text-white">
              {property.listingType === 'BUY' ? 'For Sale' : property.listingType === 'RENT' ? 'To Rent' : 'Commercial'}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-mono tracking-wider rounded-md bg-stone-100 text-slate-700 border border-stone-200">
              Ref: {property.refNumber}
            </span>
            {property.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Featured Listing
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              RERA Verified Title
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-slate-900 leading-tight">
            {property.title}
          </h1>

          <div className="flex items-center text-xs sm:text-sm text-slate-600 gap-1.5 font-medium">
            <MapPin className="w-4 h-4 text-[#9a7b38] shrink-0" />
            <span>{property.address}, {property.city}, {property.country}</span>
          </div>
        </div>

        {/* Pricing Column */}
        <div className="lg:text-right space-y-1">
          <div className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold">
            Guide Price / Rate
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {formattedPrice}
          </div>
          <div className="text-xs text-slate-500">
            {(!property.currency || property.currency === 'INR') && property.price >= 100000 && (
              <span className="font-medium text-slate-600 block">
                (Exact: {formatFullPrice(property.price, property.currency)})
              </span>
            )}
            <span className="block mt-0.5">{property.viewsCount || 0} registered property views</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        {/* Main Display Stage */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
          <img
            src={currentImage.url}
            alt={currentImage.altText || property.title}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-stone-200 transition-all"
                title="Previous photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md border border-stone-200 transition-all"
                title="Next photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Photo Counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-slate-900/80 text-white text-xs font-mono backdrop-blur-xs">
            {activeImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative shrink-0 w-24 sm:w-32 aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all shadow-2xs ${
                  activeImageIndex === idx
                    ? 'border-slate-900 ring-2 ring-slate-900/20'
                    : 'border-stone-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Specs, Description, Amenities */}
        <div className="lg:col-span-7 space-y-10">
          {/* Key Specifications Grid */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>Bedrooms</span>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {property.bedrooms > 0 ? property.bedrooms : 'Studio'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>Bathrooms</span>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {property.bathrooms}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span>Total Area</span>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {property.areaSqFt.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">sq ft</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Car className="w-4 h-4 text-slate-400" />
                <span>Parking</span>
              </div>
              <div className="font-serif text-2xl font-bold text-slate-900">
                {property.parkingSpaces ? `${property.parkingSpaces} Bays` : 'Valet'}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl text-slate-900 font-normal">
              Property Description
            </h2>
            <div className="text-sm text-slate-700 leading-relaxed font-normal space-y-4">
              <p>{property.description}</p>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl text-slate-900 font-normal">
              Property Specifications
            </h2>
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs divide-y divide-stone-100 text-xs">
              <div className="flex justify-between py-3 px-5">
                <span className="text-slate-500">Property Classification</span>
                <span className="text-slate-900 font-medium">{property.propertyType.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between py-3 px-5">
                <span className="text-slate-500">Listing Sector</span>
                <span className="text-slate-900 font-medium">{property.listingType}</span>
              </div>
              {property.yearBuilt && (
                <div className="flex justify-between py-3 px-5">
                  <span className="text-slate-500">Year Built</span>
                  <span className="text-slate-900 font-medium">{property.yearBuilt}</span>
                </div>
              )}
              {property.furnishing && (
                <div className="flex justify-between py-3 px-5">
                  <span className="text-slate-500">Furnishing</span>
                  <span className="text-slate-900 font-medium">{property.furnishing}</span>
                </div>
              )}
              <div className="flex justify-between py-3 px-5">
                <span className="text-slate-500">Property Reference</span>
                <span className="text-slate-900 font-mono font-bold">{property.refNumber}</span>
              </div>
            </div>
          </div>

          {/* Luxury Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-serif text-2xl text-slate-900 font-normal">
                Features & Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-stone-200 text-xs text-slate-800 shadow-2xs font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#9a7b38]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Contact Concierge & Submit Enquiry */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Direct Desk Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <span className="text-[10px] tracking-[0.2em] text-[#9a7b38] uppercase font-bold">
              Direct Contact
            </span>
            <h3 className="font-serif text-xl text-slate-900">Astrra Concierge Desk</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with our advisory desk for private viewings or conveyance inquiries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={phoneLink}
                className="py-3 px-4 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-slate-800 text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-slate-600" />
                <span>Call Desk</span>
              </a>
            </div>
          </div>

          {/* Enquiry Form connected directly to backend */}
          <EnquiryForm
            propertyId={property.id}
            propertyTitle={property.title}
            propertyRef={property.refNumber}
          />
        </div>
      </div>

      {/* Related Properties */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a7b38] font-bold">
              Similar Opportunities
            </span>
            <h2 className="font-serif text-3xl text-slate-900 font-normal mt-1">
              Related Properties
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((relProp) => (
              <PropertyCard key={relProp.id} property={relProp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
