import { Router, Response } from 'express';
import { prisma } from '../../db';
import { requireAdminAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

/**
 * GET /api/admin/dashboard/metrics
 * Calculate actual real database records for the dashboard
 */
router.get('/metrics', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalProperties,
      publishedProperties,
      draftProperties,
      archivedProperties,
      featuredProperties,
      totalEnquiries,
      newEnquiries,
      contactedEnquiries,
      inProgressEnquiries,
      closedEnquiries,
      recentEnquiries,
      publishedListingSum,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { status: 'PUBLISHED' } }),
      prisma.property.count({ where: { status: 'DRAFT' } }),
      prisma.property.count({ where: { status: 'ARCHIVED' } }),
      prisma.property.count({ where: { status: 'PUBLISHED', isFeatured: true } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'NEW' } }),
      prisma.enquiry.count({ where: { status: 'CONTACTED' } }),
      prisma.enquiry.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.enquiry.count({ where: { status: 'CLOSED' } }),
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: { id: true, title: true, refNumber: true },
          },
        },
      }),
      prisma.property.aggregate({
        where: { status: 'PUBLISHED', listingType: 'BUY' },
        _sum: { price: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        properties: {
          total: totalProperties,
          published: publishedProperties,
          draft: draftProperties,
          archived: archivedProperties,
          featured: featuredProperties,
          totalPortfolioValue: publishedListingSum._sum.price || 0,
        },
        enquiries: {
          total: totalEnquiries,
          new: newEnquiries,
          contacted: contactedEnquiries,
          inProgress: inProgressEnquiries,
          closed: closedEnquiries,
          pendingAction: newEnquiries + inProgressEnquiries,
        },
        recentEnquiries,
      },
    });
  } catch (error) {
    console.error('Error fetching admin dashboard metrics:', error);
    res.status(500).json({ success: false, message: 'Failed to aggregate dashboard metrics' });
  }
});

export default router;
