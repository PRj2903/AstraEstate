import { Router, Request, Response } from 'express';
import { prisma } from '../db';

const router = Router();

/**
 * GET /api/settings
 * Public business settings (contact info, WhatsApp, address, office hours)
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const settingsList = await prisma.siteSetting.findMany({});
    
    // Map to key-value object
    const settingsMap: Record<string, string> = {};
    for (const item of settingsList) {
      settingsMap[item.key] = item.value;
    }

    res.json({
      success: true,
      data: settingsMap,
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve site configuration' });
  }
});

export default router;
