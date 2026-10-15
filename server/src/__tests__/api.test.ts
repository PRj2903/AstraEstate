import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Astrra Estates API Suite', () => {
  let adminToken: string;

  beforeAll(async () => {
    // Authenticate admin for protected test cases
    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({
        email: 'admin@astreates.com',
        password: 'AstrraAdmin2026!',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.token).toBeDefined();
    adminToken = loginRes.body.data.token;
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('Astrra Estates API');
    });
  });

  describe('Public Properties API', () => {
    it('should retrieve list of published properties with pagination', async () => {
      const res = await request(app).get('/api/properties?limit=5');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.total).toBeGreaterThan(0);
      expect(res.body.meta.totalPages).toBeGreaterThanOrEqual(1);
    });

    it('should filter properties by category BUY, RENT, and COMMERCIAL', async () => {
      const buyRes = await request(app).get('/api/properties?listingType=BUY');
      expect(buyRes.status).toBe(200);
      expect(buyRes.body.data.every((p: any) => p.listingType === 'BUY')).toBe(true);

      const rentRes = await request(app).get('/api/properties?listingType=RENT');
      expect(rentRes.status).toBe(200);
      expect(rentRes.body.data.every((p: any) => p.listingType === 'RENT')).toBe(true);

      const commRes = await request(app).get('/api/properties?listingType=COMMERCIAL');
      expect(commRes.status).toBe(200);
      expect(commRes.body.data.every((p: any) => p.listingType === 'COMMERCIAL')).toBe(true);
    });

    it('should retrieve single property by slug with images and related properties', async () => {
      const res = await request(app).get('/api/properties/the-aurelia-sky-penthouse');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.refNumber).toBe('AST-1001');
      expect(res.body.data.images.length).toBeGreaterThan(0);
      expect(Array.isArray(res.body.data.amenities)).toBe(true);
      expect(Array.isArray(res.body.related)).toBe(true);
    });

    it('should return 404 for non-existent property', async () => {
      const res = await request(app).get('/api/properties/non-existent-slug-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Public Enquiries API', () => {
    it('should reject enquiry with invalid email or phone', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .send({
          name: 'T',
          email: 'not-an-email',
          phone: '12',
          message: 'short',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors.length).toBeGreaterThan(0);
    });

    it('should successfully submit valid customer enquiry', async () => {
      const res = await request(app)
        .post('/api/enquiries')
        .send({
          name: 'Lady Genevieve Sterling',
          email: 'g.sterling@mayfairholdings.co.uk',
          phone: '+44 20 7123 4567',
          preferredContact: 'WHATSAPP',
          message: 'Requesting confidential viewing coordinates for prime London residential offerings.',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.refNumber).toMatch(/^ENQ-\d{4}$/);
    });
  });

  describe('Public Settings API', () => {
    it('should return site contact information', async () => {
      const res = await request(app).get('/api/settings');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.company_name).toBe('Astrra Estates');
      expect(res.body.data.contact_phone).toBeDefined();
      expect(res.body.data.whatsapp_number).toBeDefined();
    });
  });

  describe('Admin Authorization Security', () => {
    it('should reject unauthorized request without Bearer token', async () => {
      const res = await request(app).get('/api/admin/dashboard/metrics');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid administrative login credentials', async () => {
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({
          email: 'admin@astreates.com',
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Admin Dashboard and Management Workflow', () => {
    it('should calculate live metrics from database records', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/metrics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.properties.total).toBeGreaterThanOrEqual(16);
      expect(res.body.data.enquiries.total).toBeGreaterThanOrEqual(12);
      expect(res.body.data.properties.totalPortfolioValue).toBeGreaterThan(0);
    });

    it('should update enquiry status and persist private internal notes', async () => {
      // Fetch an enquiry first
      const enqListRes = await request(app)
        .get('/api/admin/enquiries?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      const testEnquiry = enqListRes.body.data[0];
      expect(testEnquiry).toBeDefined();

      const updateRes = await request(app)
        .patch(`/api/admin/enquiries/${testEnquiry.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          status: 'CONTACTED',
          internalNotes: 'Client contacted via secure line. Dossier dispatched.',
        });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.data.status).toBe('CONTACTED');
      expect(updateRes.body.data.internalNotes).toBe('Client contacted via secure line. Dossier dispatched.');
    });

    it('should toggle property status (publish / unpublish)', async () => {
      const propListRes = await request(app)
        .get('/api/admin/properties?limit=1')
        .set('Authorization', `Bearer ${adminToken}`);

      const testProp = propListRes.body.data[0];
      expect(testProp).toBeDefined();

      // Change status to DRAFT
      const patchRes = await request(app)
        .patch(`/api/admin/properties/${testProp.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'DRAFT' });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.data.status).toBe('DRAFT');

      // Revert back to PUBLISHED
      const revertRes = await request(app)
        .patch(`/api/admin/properties/${testProp.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'PUBLISHED' });

      expect(revertRes.status).toBe(200);
      expect(revertRes.body.data.status).toBe('PUBLISHED');
    });
  });
});
