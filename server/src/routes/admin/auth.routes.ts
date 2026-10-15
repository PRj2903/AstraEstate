import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db';
import { validateBody } from '../../middleware/validation';
import { loginSchema, LoginInput } from '../../validators/auth.validator';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { requireAdminAuth, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'astrea-luxury-estates-jwt-secret-key-2026-secure';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * POST /api/admin/auth/login
 * Administrative login endpoint
 */
router.post(
  '/login',
  authRateLimiter,
  validateBody(loginSchema),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password }: LoginInput = req.body;

      const admin = await prisma.adminUser.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!admin) {
        res.status(401).json({
          success: false,
          message: 'Invalid administrative email or password.',
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid administrative email or password.',
        });
        return;
      }

      // Update last login
      await prisma.adminUser.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() },
      });

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN as any }
      );

      res.json({
        success: true,
        message: 'Administrative authentication successful.',
        data: {
          token,
          user: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, message: 'Internal server error during authentication.' });
    }
  }
);

/**
 * GET /api/admin/auth/me
 * Get current authenticated administrator profile
 */
router.get('/me', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    data: req.adminUser,
  });
});

export default router;
