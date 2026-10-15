import { z } from 'zod';

export const createEnquirySchema = z.object({
  propertyId: z.string().optional().nullable(),
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: z.string().trim().min(7, 'Please enter a valid telephone number with country code').max(30),
  preferredContact: z.enum(['EMAIL', 'PHONE', 'WHATSAPP'] as const).default('EMAIL'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

export const updateEnquirySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED', 'SPAM'] as const).optional(),
  internalNotes: z.string().optional().nullable(),
});

export const enquiryFilterQuerySchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED', 'SPAM'] as const).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(15),
});

export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type UpdateEnquiryInput = z.infer<typeof updateEnquirySchema>;
export type EnquiryFilterQuery = z.infer<typeof enquiryFilterQuerySchema>;
