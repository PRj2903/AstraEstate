export interface PropertyImage {
  id?: string;
  propertyId?: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export type ListingType = 'BUY' | 'RENT' | 'COMMERCIAL';
export type PropertyStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Property {
  id: string;
  refNumber: string;
  title: string;
  slug: string;
  tagline?: string | null;
  description: string;
  listingType: ListingType;
  propertyType: string;
  status: PropertyStatus;
  isFeatured: boolean;
  price: number;
  currency: string;
  pricePrefix?: string | null;
  priceSuffix?: string | null;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  yearBuilt?: number | null;
  furnishing?: string | null;
  parkingSpaces?: number | null;
  address: string;
  locality?: string | null;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  amenities: string[];
  virtualTourUrl?: string | null;
  videoUrl?: string | null;
  viewsCount?: number;
  createdAt: string;
  updatedAt?: string;
  images: PropertyImage[];
  enquiryCount?: number;
}

export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CLOSED' | 'SPAM';
export type PreferredContact = 'EMAIL' | 'PHONE' | 'WHATSAPP';

export interface Enquiry {
  id: string;
  refNumber: string;
  propertyId?: string | null;
  property?: {
    id: string;
    refNumber: string;
    title: string;
    slug?: string;
    price?: number;
    currency?: string;
    city?: string;
    images?: PropertyImage[];
  } | null;
  name: string;
  email: string;
  phone: string;
  preferredContact: PreferredContact;
  message: string;
  status: EnquiryStatus;
  internalNotes?: string | null;
  source?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
}

export interface PropertyFilterParams {
  search?: string;
  listingType?: ListingType | '';
  propertyType?: string;
  city?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  isFeatured?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'area-desc';
  page?: number;
  limit?: number;
}

export interface SiteSettings {
  company_name?: string;
  tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  whatsapp_number?: string;
  office_address?: string;
  office_hours?: string;
  currency_symbol?: string;
  whatsapp_template?: string;
  [key: string]: string | undefined;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface DashboardMetrics {
  properties: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    featured: number;
    totalPortfolioValue: number;
  };
  enquiries: {
    total: number;
    new: number;
    contacted: number;
    inProgress: number;
    closed: number;
    pendingAction: number;
  };
  recentEnquiries: Enquiry[];
}
