import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield, Award, Globe, MessageSquare, Phone, Sparkles, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import type { Property } from '../types';
import { api } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useSettings } from '../context/SettingsContext';

export const HomePage: React.FC = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { getWhatsAppUrl } = useSettings();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getFeaturedProperties();
        setFeaturedProperties(data);
      } catch (err) {
        console.error('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const whatsappUrl = getWhatsAppUrl('Hello Astrra Estates concierge, I would like to schedule a private consultation.');

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      title: 'The Aurelia Sky Penthouse',
      location: 'Worli Sea Face, Mumbai',
      price: '₹ 45 Cr',
      specs: '8,200 Sq Ft • 5 Beds • Cantilever Infinity Pool',
      badge: 'Seafront Masterpiece',
      slug: 'the-aurelia-sky-penthouse',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2400&q=85',
    },
    {
      title: 'Awas Coastal Beachfront Estate',
      location: 'Awas Beach, Alibaug Riviera',
      price: '₹ 24 Cr',
      specs: '8,000 Sq Ft • 1.5 Acre Freehold • Direct Beach Path',
      badge: 'Private Coastal Compound',
      slug: 'awas-coastal-beachfront-estate',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2400&q=85',
    },
    {
      title: 'Jubilee Crown Manor',
      location: 'Road No. 36, Jubilee Hills, Hyderabad',
      price: '₹ 42 Cr',
      specs: '12,000 Sq Ft • 12-Car Subterranean Gallery • Squash Court',
      badge: 'Neo-Classical Estate',
      slug: 'jubilee-crown-manor',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=85',
    },
  ];

  // Auto advance hero slideshow every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <div className="space-y-24 pb-20">
      {/* ========================================================
          HERO SECTION — High-Impact Architectural Estate Showcase
          ======================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-20 pb-28 px-4 overflow-hidden bg-slate-950">
        {/* Background Slideshow with Smooth Transitions */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.title}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] transition-transform duration-10000 ease-out"
            />
          </div>
        ))}

        {/* Sophisticated Architectural Dark Gradient Overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/70" />
        <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(15,23,42,0.6)_100%)]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-7 pt-4">
          {/* Brand Crest / Pre-title Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-[#c5a059]/40 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
            <span className="font-display text-[10px] sm:text-[11px] tracking-[0.28em] text-[#e8d5a7] uppercase font-bold">
              Astrra Estates • Private Wealth & Architectural Living
            </span>
          </div>

          {/* Epic Real Estate Editorial Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-white tracking-tight leading-[1.06] drop-shadow-2xl">
            Extraordinary Living. <br />
            <span className="italic font-light text-stone-200">Unrivalled Addresses.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-normal leading-relaxed drop-shadow">
            Representing off-market seafront penthouses, private coastal sanctuaries, and landmark commercial developments across Mumbai, Delhi-NCR, Bengaluru, Goa, Hyderabad, and Alibaug.
          </p>

          {/* Interactive Multi-Criteria Search Widget */}
          <div className="pt-2">
            <SearchBar />
          </div>

          {/* Quick Curated Market Shortcuts */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-stone-300">
            <span className="text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mr-1">
              Curated Markets:
            </span>
            {[
              { label: '🌊 Worli Sea Face', path: '/properties?search=Worli' },
              { label: '🌿 Pali Hill Bandra', path: '/properties?search=Bandra' },
              { label: '🏛️ Lutyens & Gurugram', path: '/properties?search=Delhi' },
              { label: '🏖️ North Goa Riviera', path: '/properties?search=Goa' },
              { label: '🌴 Alibaug Beachfront', path: '/properties?search=Alibaug' },
              { label: '🛡️ RERA Verified Titles', path: '/properties?isFeatured=true' },
            ].map((chip) => (
              <Link
                key={chip.label}
                to={chip.path}
                className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-stone-200 hover:text-white transition-all text-[11px] font-medium backdrop-blur-sm"
              >
                {chip.label}
              </Link>
            ))}
          </div>

          {/* Trust Indicators Strip */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">₹2,500+ Cr</div>
              <div className="text-[11px] text-stone-400 tracking-wider uppercase font-medium mt-0.5">Curated Portfolio</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-[11px] text-stone-400 tracking-wider uppercase font-medium mt-0.5">RERA & Title Verified</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">8 Hubs</div>
              <div className="text-[11px] text-stone-400 tracking-wider uppercase font-medium mt-0.5">Prime Indian Metros</div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#c5a059]">24/7</div>
              <div className="text-[11px] text-stone-400 tracking-wider uppercase font-medium mt-0.5">Private Concierge Desk</div>
            </div>
          </div>
        </div>

        {/* Floating Featured Estate Spotlight Pill (Desktop) */}
        <div className="hidden xl:flex absolute bottom-8 right-8 z-20 items-center gap-3 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 pr-5 shadow-2xl text-left max-w-sm">
          <img
            src={heroSlides[activeSlide].image}
            alt={heroSlides[activeSlide].title}
            className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
          />
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-[#c5a059]/20 text-[#e8d5a7] border border-[#c5a059]/30">
                {heroSlides[activeSlide].badge}
              </span>
              <span className="text-xs font-bold text-white">
                {heroSlides[activeSlide].price}
              </span>
            </div>
            <p className="text-xs font-serif font-medium text-white truncate">
              {heroSlides[activeSlide].title}
            </p>
            <p className="text-[11px] text-stone-400 truncate">
              {heroSlides[activeSlide].location}
            </p>
          </div>
          <Link
            to={`/properties/${heroSlides[activeSlide].slug}`}
            className="ml-2 p-2 rounded-lg bg-[#c5a059] text-slate-950 hover:bg-[#d8b56d] transition-colors shrink-0"
            title="View Estate Dossier"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Slide Selector Indicators (Bottom Left Desktop) */}
        <div className="hidden sm:flex absolute bottom-8 left-8 z-20 items-center gap-2">
          {heroSlides.map((slide, idx) => (
            <button
              key={slide.title}
              onClick={() => setActiveSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeSlide ? 'w-8 bg-[#c5a059]' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              title={`Slide to ${slide.title}`}
            />
          ))}
          <span className="text-[11px] text-stone-400 font-mono ml-2">
            0{activeSlide + 1} / 0{heroSlides.length}
          </span>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-stone-200 pb-6">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a7b38] font-bold">
              Signature Portfolio
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal mt-1">
              Featured Properties
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Hand-picked estates commanding prime international addresses, architectural distinction, and peerless craftsmanship.
            </p>
          </div>

          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-slate-900 hover:text-[#9a7b38] transition-colors"
          >
            <span>View All Estates</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading signature properties..." />
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
            <p className="text-slate-500 text-sm">No featured properties found at this moment.</p>
          </div>
        )}
      </section>

      {/* Property Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a7b38] font-bold">
            Tailored Acquisitions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal mt-1">
            Discover by Sector
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
            Whether seeking an extraordinary family residence, an executive lease, or prime commercial assets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category: Buy */}
          <Link
            to="/properties?listingType=BUY"
            className="group relative h-96 rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm p-8 flex flex-col justify-end transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80"
              alt="Properties for Sale"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] tracking-wider uppercase font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded">
                Acquisitions
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Properties for Sale
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed font-light line-clamp-2">
                Generational villas, oceanfront compounds, and iconic sky penthouses across resilient global markets.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#c2a265] transition-colors">
                <span>Browse Listings</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Category: Rent */}
          <Link
            to="/properties?listingType=RENT"
            className="group relative h-96 rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm p-8 flex flex-col justify-end transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
              alt="Properties for Rent"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] tracking-wider uppercase font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded">
                Private Tenancies
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Luxury Long-Term Leases
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed font-light line-clamp-2">
                Fully serviced turnkey residences, hotel-serviced suites, and executive homes with concierge amenities.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#c2a265] transition-colors">
                <span>Browse Rentals</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Category: Commercial */}
          <Link
            to="/properties?listingType=COMMERCIAL"
            className="group relative h-96 rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm p-8 flex flex-col justify-end transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="Commercial Real Estate"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
            <div className="relative z-10 space-y-2 text-white">
              <span className="text-[10px] tracking-wider uppercase font-semibold bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded">
                Corporate Real Estate
              </span>
              <h3 className="font-serif text-2xl font-normal text-white">
                Commercial & Prime Retail
              </h3>
              <p className="text-xs text-stone-200 leading-relaxed font-light line-clamp-2">
                Flagship financial centre floor plates, Mayfair townhouses, and trophy high-street luxury retail showcases.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-white group-hover:text-[#c2a265] transition-colors">
                <span>Browse Commercial</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Global Destinations Highlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a7b38] font-bold">
              Prime Destinations
            </span>
            <h2 className="font-serif text-3xl text-slate-900 font-normal mt-1">
              Gateway Markets
            </h2>
          </div>
          <Link to="/properties" className="text-xs font-semibold uppercase tracking-wider text-slate-700 hover:text-slate-900 flex items-center gap-1">
            <span>Explore all cities</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { city: 'Mumbai', country: 'Maharashtra', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80' },
            { city: 'New Delhi', country: 'Delhi NCR', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80' },
            { city: 'Bengaluru', country: 'Karnataka', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80' },
            { city: 'Goa', country: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
            { city: 'Hyderabad', country: 'Telangana', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
            { city: 'Alibaug', country: 'Maharashtra', img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80' },
          ].map((item) => (
            <Link
              key={item.city}
              to={`/properties?city=${encodeURIComponent(item.city)}`}
              className="group relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={item.img}
                alt={item.city}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="font-serif text-base font-semibold leading-tight">{item.city}</div>
                <div className="text-[10px] text-stone-300 font-light">{item.country}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Pillars Section */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-800">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-slate-900">Absolute Discretion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operating under strict confidentiality protocols, safeguarding principal privacy, and brokering off-market acquisitions for India's leading business families.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-800">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-slate-900">Architectural Provenance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every listing is vetted for construction pedigree, Vastu Shastra alignment, environmental standards, and generational wealth preservation.
              </p>
            </div>

            <div className="space-y-3 p-6 bg-white rounded-2xl border border-stone-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-slate-800">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-medium text-slate-900">RERA & Title Assurance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete title diligence, 30-year search, encumbrance verification, and direct alignment with State Real Estate Regulatory Authorities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-14 bg-white border border-stone-200 shadow-sm text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a7b38] font-bold">
              Private Client Consultation
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 font-normal">
              Schedule a Private Portfolio Viewing
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
              Connect directly with our senior acquisitions desk for confidential property dossiers, viewing coordination, or bespoke investment mandates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Desk</span>
            </a>

            <Link
              to="/contact"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs tracking-wider uppercase transition-all"
            >
              <span>Submit Viewing Mandate</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
