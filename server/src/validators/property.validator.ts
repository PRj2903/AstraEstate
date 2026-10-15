import { z } from 'zod';

export const propertyImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url('Image must be a valid URL'),
  altText: z.string().optional().default(''),
  isPrimary: z.boolean().default(false),
  displayOrder: z.number().int().default(0),
});

export const createPropertySchema = z.object({
  refNumber: z.string().min(3, 'Ref number must be at least 3 characters'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  tagline: z.string().optional().nullable(),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  listingType: z.enum(['BUY', 'RENT', 'COMMERCIAL'] as const),
  propertyType: z.string().min(2, 'Property type is required'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const).default('PUBLISHED'),
  isFeatured: z.boolean().default(false),
  price: z.number().positive('Price must be greater than 0'),
  currency: z.string().default('USD'),
  pricePrefix: z.string().optional().nullable(),
  priceSuffix: z.string().optional().nullable(),
  bedrooms: z.number().int().min(0).default(0),
  bathrooms: z.number().min(0).default(0),
  areaSqFt: z.number().positive('Area must be greater than 0'),
  yearBuilt: z.number().int().optional().nullable(),
  furnishing: z.string().optional().nullable(),
  parkingSpaces: z.number().int().min(0).optional().nullable(),
  address: z.string().min(3, 'Address is required'),
  locality: z.string().optional().nullable(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional().nullable(),
  country: z.string().min(2, 'Country is required'),
  postalCode: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  amenities: z.array(z.string()).default([]),
  virtualTourUrl: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  images: z.array(propertyImageSchema).min(1, 'At least one property image is required'),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyFilterQuerySchema = z.object({
  search: z.string().optional(),
  listingType: z.enum(['BUY', 'RENT', 'COMMERCIAL'] as const).optional(),
  propertyType: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  isFeatured: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
  sortBy: z.enum(['newest', 'price-asc', 'price-desc', 'area-desc'] as const).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type PropertyFilterQuery = z.infer<typeof propertyFilterQuerySchema>;
