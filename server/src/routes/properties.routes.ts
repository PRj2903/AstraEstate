import { Router, Request, Response } from 'express';
import { prisma } from '../db';
import { validateQuery } from '../middleware/validation';
import { propertyFilterQuerySchema, PropertyFilterQuery } from '../validators/property.validator';

const router = Router();

// Helper to format property output
export const formatProperty = (property: any) => {
  let amenitiesList: string[] = [];
  try {
    amenitiesList = typeof property.amenities === 'string' ? JSON.parse(property.amenities) : (property.amenities || []);
  } catch (e) {
    amenitiesList = [];
  }

  return {
    ...property,
    amenities: amenitiesList,
  };
};

/**
 * GET /api/properties/featured
 * Returns featured published properties for the homepage
 */
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const featured = await prisma.property.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    res.json({
      success: true,
      data: featured.map(formatProperty),
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve featured properties' });
  }
});

/**
 * GET /api/properties/locations/list
 * Distinct cities available in published inventory
 */
router.get('/locations/list', async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      where: { status: 'PUBLISHED' },
      select: { city: true },
      distinct: ['city'],
    });

    const locations = properties.map((p) => p.city).sort();

    res.json({
      success: true,
      data: locations,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve locations' });
  }
});

/**
 * GET /api/properties
 * Public filtered search and pagination
 */
router.get('/', validateQuery(propertyFilterQuerySchema), async (req: Request, res: Response) => {
  try {
    const query = ((req as any).validatedQuery || req.query) as unknown as PropertyFilterQuery;
    const {
      search,
      listingType,
      propertyType,
      city,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      isFeatured,
      sortBy,
      page,
      limit,
    } = query;

    const where: any = {
      status: 'PUBLISHED',
    };

    if (listingType) {
      where.listingType = listingType;
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (city) {
      where.city = { contains: city };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (bedrooms !== undefined) {
      where.bedrooms = { gte: bedrooms };
    }

    if (bathrooms !== undefined) {
      where.bathrooms = { gte: bathrooms };
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { title: { contains: term } },
        { refNumber: { contains: term } },
        { city: { contains: term } },
        { address: { contains: term } },
        { locality: { contains: term } },
        { description: { contains: term } },
      ];
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc') orderBy = { price: 'asc' };
    else if (sortBy === 'price-desc') orderBy = { price: 'desc' };
    else if (sortBy === 'area-desc') orderBy = { areaSqFt: 'desc' };
    else if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [totalCount, items] = await Promise.all([
      prisma.property.count({ where }),
      prisma.property.findMany({
        where,
        include: {
          images: {
            orderBy: { displayOrder: 'asc' },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    res.json({
      success: true,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
      },
      data: items.map(formatProperty),
    });
  } catch (error) {
    console.error('Error querying properties:', error);
    res.status(500).json({ success: false, message: 'Failed to search properties' });
  }
});

/**
 * GET /api/properties/:slugOrId
 * Retrieve single property details with gallery and related items
 */
router.get('/:slugOrId', async (req: Request, res: Response): Promise<void> => {
  try {
    const slugOrId = String(req.params.slugOrId);

    const property = await prisma.property.findFirst({
      where: {
        status: 'PUBLISHED',
        OR: [
          { slug: slugOrId },
          { id: slugOrId },
          { refNumber: slugOrId },
        ],
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!property) {
      res.status(404).json({ success: false, message: 'Property listing not found or is no longer active.' });
      return;
    }

    // Increment view count in background
    prisma.property.update({
      where: { id: property.id },
      data: { viewsCount: { increment: 1 } },
    }).catch((e) => console.error('Failed to increment viewsCount:', e));

    // Fetch related properties (same listingType or same city, excluding this one)
    const related = await prisma.property.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: property.id },
        OR: [
          { listingType: property.listingType },
          { city: property.city },
        ],
      },
      include: {
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
      take: 3,
    });

    res.json({
      success: true,
      data: formatProperty(property),
      related: related.map(formatProperty),
    });
  } catch (error) {
    console.error('Error fetching property detail:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve property details' });
  }
});

export default router;
