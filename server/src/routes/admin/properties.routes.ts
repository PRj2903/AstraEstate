import { Router, Response } from 'express';
import { prisma } from '../../db';
import { requireAdminAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validation';
import {
  createPropertySchema,
  updatePropertySchema,
  CreatePropertyInput,
  UpdatePropertyInput,
} from '../../validators/property.validator';
import { formatProperty } from '../properties.routes';

const router = Router();

// Require admin authentication for all routes here
router.use(requireAdminAuth);

/**
 * GET /api/admin/properties
 * List all properties (all statuses) with filter & search
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, page = '1', limit = '15', listingType } = req.query as Record<string, string>;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 15;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (listingType) {
      where.listingType = listingType;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { title: { contains: term } },
        { refNumber: { contains: term } },
        { city: { contains: term } },
        { address: { contains: term } },
      ];
    }

    const [totalCount, items] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
          _count: {
            select: { enquiries: true },
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
      data: items.map((item) => ({
        ...formatProperty(item),
        enquiryCount: item._count.enquiries,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin properties:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve properties' });
  }
});

/**
 * GET /api/admin/properties/:id
 * Retrieve single property for editing
 */
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        enquiries: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!property) {
      res.status(404).json({ success: false, message: 'Property not found' });
      return;
    }

    res.json({
      success: true,
      data: formatProperty(property),
    });
  } catch (error) {
    console.error('Error fetching property for edit:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve property' });
  }
});

/**
 * POST /api/admin/properties
 * Create a new property listing
 */
router.post(
  '/',
  validateBody(createPropertySchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const data: CreatePropertyInput = req.body;

      // Check unique refNumber
      const existingRef = await prisma.property.findUnique({
        where: { refNumber: data.refNumber },
      });
      if (existingRef) {
        res.status(400).json({ success: false, message: `Property reference '${data.refNumber}' already exists.` });
        return;
      }

      // Check unique slug
      const existingSlug = await prisma.property.findUnique({
        where: { slug: data.slug },
      });
      if (existingSlug) {
        res.status(400).json({ success: false, message: `Property slug '${data.slug}' already exists.` });
        return;
      }

      const { images, amenities, ...propData } = data;

      const newProperty = await prisma.property.create({
        data: {
          ...propData,
          amenities: JSON.stringify(amenities),
          images: {
            create: images.map((img, idx) => ({
              url: img.url,
              altText: img.altText || data.title,
              isPrimary: img.isPrimary || idx === 0,
              displayOrder: img.displayOrder || idx + 1,
            })),
          },
        },
        include: {
          images: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Property listing created successfully.',
        data: formatProperty(newProperty),
      });
    } catch (error) {
      console.error('Error creating property:', error);
      res.status(500).json({ success: false, message: 'Failed to create property' });
    }
  }
);

/**
 * PUT /api/admin/properties/:id
 * Full update of an existing property
 */
router.put(
  '/:id',
  validateBody(updatePropertySchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const data: UpdatePropertyInput = req.body;

      const existing = await prisma.property.findUnique({ where: { id } });
      if (!existing) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      // Check ref uniqueness if changed
      if (data.refNumber && data.refNumber !== existing.refNumber) {
        const dupRef = await prisma.property.findUnique({ where: { refNumber: data.refNumber } });
        if (dupRef) {
          res.status(400).json({ success: false, message: `Reference number '${data.refNumber}' already exists.` });
          return;
        }
      }

      // Check slug uniqueness if changed
      if (data.slug && data.slug !== existing.slug) {
        const dupSlug = await prisma.property.findUnique({ where: { slug: data.slug } });
        if (dupSlug) {
          res.status(400).json({ success: false, message: `Slug '${data.slug}' already exists.` });
          return;
        }
      }

      const { images, amenities, ...propData } = data;

      // Update basic fields
      const updatePayload: any = { ...propData };
      if (amenities !== undefined) {
        updatePayload.amenities = JSON.stringify(amenities);
      }

      // If images provided, recreate them
      if (images && images.length > 0) {
        await prisma.propertyImage.deleteMany({ where: { propertyId: id } });
        await prisma.propertyImage.createMany({
          data: images.map((img, idx) => ({
            propertyId: id,
            url: img.url,
            altText: img.altText || existing.title,
            isPrimary: img.isPrimary || idx === 0,
            displayOrder: img.displayOrder || idx + 1,
          })),
        });
      }

      const updated = await prisma.property.update({
        where: { id },
        data: updatePayload,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
      });

      res.json({
        success: true,
        message: 'Property updated successfully.',
        data: formatProperty(updated),
      });
    } catch (error) {
      console.error('Error updating property:', error);
      res.status(500).json({ success: false, message: 'Failed to update property' });
    }
  }
);

/**
 * PATCH /api/admin/properties/:id/status
 * Quick toggle or change of listing status (DRAFT, PUBLISHED, ARCHIVED)
 */
router.patch('/:id/status', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { status } = req.body;

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status value. Must be DRAFT, PUBLISHED, or ARCHIVED.' });
      return;
    }

    const updated = await prisma.property.update({
      where: { id },
      data: { status },
      select: { id: true, refNumber: true, title: true, status: true },
    });

    res.json({
      success: true,
      message: `Property status updated to ${status}.`,
      data: updated,
    });
  } catch (error) {
    console.error('Error changing property status:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

/**
 * PATCH /api/admin/properties/:id/featured
 * Toggle featured flag
 */
router.patch('/:id/featured', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const { isFeatured } = req.body;

    if (typeof isFeatured !== 'boolean') {
      res.status(400).json({ success: false, message: 'isFeatured must be a boolean.' });
      return;
    }

    const updated = await prisma.property.update({
      where: { id },
      data: { isFeatured },
      select: { id: true, refNumber: true, title: true, isFeatured: true },
    });

    res.json({
      success: true,
      message: `Property feature status set to ${isFeatured}.`,
      data: updated,
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle featured status' });
  }
});

/**
 * DELETE /api/admin/properties/:id
 * Delete property listing
 */
router.delete('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    await prisma.property.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Property listing deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ success: false, message: 'Failed to delete property' });
  }
});

export default router;
