import { Router, Response } from 'express';
import { prisma } from '../../db';
import { requireAdminAuth, AuthenticatedRequest } from '../../middleware/auth';
import { validateBody } from '../../middleware/validation';
import { updateSettingsSchema, UpdateSettingsInput } from '../../validators/settings.validator';

const router = Router();

// Require admin authentication
router.use(requireAdminAuth);

/**
 * GET /api/admin/settings
 * Retrieve all settings with descriptions
 */
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' },
    });

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve site configuration' });
  }
});

/**
 * PUT /api/admin/settings
 * Batch update settings key-value pairs
 */
router.put(
  '/',
  validateBody(updateSettingsSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const updates: UpdateSettingsInput = req.body;

      for (const [key, value] of Object.entries(updates)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }

      const allUpdated = await prisma.siteSetting.findMany();

      res.json({
        success: true,
        message: 'Business configuration settings updated successfully.',
        data: allUpdated,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ success: false, message: 'Failed to update site configuration' });
    }
  }
);

export default router;
