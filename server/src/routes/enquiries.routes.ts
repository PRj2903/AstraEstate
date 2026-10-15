import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validateBody } from '../middleware/validation';
import { createEnquirySchema, CreateEnquiryInput } from '../validators/enquiry.validator';
import { enquiryRateLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/enquiries
 * Submit a customer enquiry or private viewing request
 */
router.post(
  '/',
  enquiryRateLimiter,
  validateBody(createEnquirySchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateEnquiryInput = req.body;

      // Verify property exists if propertyId supplied
      let associatedPropertyTitle: string | null = null;
      let associatedPropertyRef: string | null = null;

      if (data.propertyId) {
        const property = await prisma.property.findUnique({
          where: { id: data.propertyId },
          select: { id: true, title: true, refNumber: true, status: true },
        });

        if (property) {
          associatedPropertyTitle = property.title;
          associatedPropertyRef = property.refNumber;
        }
      }

      // Generate unique refNumber: ENQ- + random 4 digit hex
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const refNumber = `ENQ-${randomSuffix}`;

      const newEnquiry = await prisma.enquiry.create({
        data: {
          refNumber,
          propertyId: data.propertyId || null,
          name: data.name,
          email: data.email,
          phone: data.phone,
          preferredContact: data.preferredContact,
          message: data.message,
          status: 'NEW',
          source: 'WEBSITE',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Your enquiry has been received by our private client concierge team. An advisor will contact you shortly.',
        data: {
          refNumber: newEnquiry.refNumber,
          propertyTitle: associatedPropertyTitle,
          propertyRef: associatedPropertyRef,
          receivedAt: newEnquiry.createdAt,
        },
      });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      res.status(500).json({
        success: false,
        message: 'Unable to submit enquiry at this moment. Please try again or reach our concierge directly.',
      });
    }
  }
);

export default router;
