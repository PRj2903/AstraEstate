import { Router, Response } from 'express';
import { prisma } from '../../db';
import { requireAdminAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validation';
import { updateEnquirySchema, UpdateEnquiryInput } from '../../validators/enquiry.validator';

const router = Router();

// Require admin authentication for all enquiry admin routes
router.use(requireAdminAuth);

/**
 * GET /api/admin/enquiries
 * Retrieve enquiries with status filtering and search
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, page = '1', limit = '15' } = req.query as Record<string, string>;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { refNumber: { contains: term } },
        { name: { contains: term } },
        { email: { contains: term } },
        { phone: { contains: term } },
        { message: { contains: term } },
      ];
    }

    const [totalCount, items] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        include: {
          property: {
            select: {
              id: true,
              refNumber: true,
              title: true,
              slug: true,
              price: true,
              currency: true,
              city: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    res.json({
      success: true,
      meta: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages,
      },
      data: items,
    });
  } catch (error) {
    console.error('Error fetching admin enquiries:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve customer enquiries' });
  }
});

/**
 * GET /api/admin/enquiries/:id
 * Retrieve single enquiry details
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    const enquiry = await prisma.enquiry.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            images: {
              take: 1,
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    res.json({
      success: true,
      data: enquiry,
    });
  } catch (error) {
    console.error('Error fetching enquiry detail:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve enquiry' });
  }
});

/**
 * PATCH /api/admin/enquiries/:id
 * Update status and private internal notes
 */
router.patch(
  '/:id',
  validateBody(updateEnquirySchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const data: UpdateEnquiryInput = req.body;

      const existing = await prisma.enquiry.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ success: false, message: 'Enquiry not found' });
        return;
      }

      const updated = await prisma.enquiry.update({
        where: { id },
        data: {
          ...(data.status ? { status: data.status } : {}),
          ...(data.internalNotes !== undefined ? { internalNotes: data.internalNotes } : {}),
        },
        include: {
          property: {
            select: { id: true, refNumber: true, title: true },
          },
        },
      });

      res.json({
        success: true,
        message: 'Enquiry status and notes updated successfully.',
        data: updated,
      });
    } catch (error) {
      console.error('Error updating enquiry:', error);
      res.status(500).json({ success: false, message: 'Failed to update enquiry' });
    }
  }
);

/**
 * DELETE /api/admin/enquiries/:id
 * Remove enquiry
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    await prisma.enquiry.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Enquiry record deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
  }
});

export default router;
