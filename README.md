# Astrra Estates — Full-Stack Luxury Real Estate Platform (Indian Market Edition)

> **Client:** ASTRRA TECH  
> **Platform Name:** Astrra Estates  
> **Market Specialization:** Indian Prime Luxury Real Estate (Mumbai, New Delhi-NCR, Bengaluru, Goa, Hyderabad, Alibaug, Pune, Chennai)  
> **Currency System:** Indian Rupees (₹) formatted dynamically in Crores (Cr) and Lakhs  
> **Compliance & Standards:** RERA Title Verification, Vastu Shastra Compliance  
> **Version:** 1.0.0 (Production Ready)  
> **Aesthetic:** Editorial Architectural Luxury (Dark Mode, Muted Gold `#d4af37`, Ivory Accents, Glassmorphism)

---

## 1. Project Overview

**Astrra Estates** is a full-stack, database-connected web application created for **ASTRRA TECH**, specifically tailored for the **Indian prime and ultra-luxury real estate market**. Built with strict adherence to senior engineering patterns, the platform enables high-net-worth individuals, family offices, and NRI investors to discover off-market residential and commercial properties, conduct multi-criteria searches, filter and sort by dynamic parameters, view interactive architectural dossiers, and submit confidential inquiries.

Administrators have access to a secure, dedicated dashboard to manage properties, calculate live portfolio analytics from database records, process customer inquiries with private internal notes, and configure business touchpoints (including direct telephone and prefilled WhatsApp concierge links configured for Indian business hours).

> **Demonstration Notice:** All sample properties, photography, prices, and enquiries are fictional demonstration content created to showcase full-stack capabilities for ASTRRA TECH. Listings feature sample RERA registration identifiers (e.g., MahaRERA, HRERA, RERA Karnataka) for realistic enterprise demonstration.

---

## 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite 8, React Router 7, Lucide Icons |
| **Styling** | Tailwind CSS v4, Custom Glassmorphism, Responsive Editorial Theme |
| **Backend API** | Node.js (v22+), Express 5 REST API, TypeScript |
| **Database & ORM** | Prisma ORM 6 with MySQL (Production) & SQLite (Zero-Config Dev) |
| **Validation** | Zod (v4) Schema Validation for Request Bodies & Query Parameters |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt Password Hashing, Helmet Security Headers, CORS, Express-Rate-Limit (Spam & Brute-force protection) |
| **Testing** | Vitest 5, Supertest 7, End-to-End Browser Automation Subagent |

---

## 3. Database Architecture & Schema Relationships

The database is modeled via Prisma with normalized relations and referential integrity:

```
┌─────────────────┐       1:N       ┌──────────────────┐
│    Property     │─────────────────┤  PropertyImage   │
│  (Ref, Price,   │                 │ (URL, Primary,   │
│   Slug, Specs,  │                 │  Display Order)  │
│   Amenities)    │                 └──────────────────┘
└────────┬────────┘
         │
         │ 1:N (SetNull on delete)
         │
┌────────┴────────┐
│     Enquiry     │
│  (RefNumber,    │
│   Client Info,  │
│   Status, Notes)│
└─────────────────┘

┌─────────────────┐       ┌──────────────────┐
│    AdminUser    │       │   SiteSetting    │
│  (Email, Hash,  │       │  (Key-Value      │
│   Role, Session)│       │   Configuration) │
└─────────────────┘       └──────────────────┘
```

### Models:
1. **AdminUser**: Stores administrator accounts with salted bcrypt hashes, timestamps, and roles.
2. **Property**: Represents residential or commercial properties with unique slug, reference number (`AST-XXXX`), listing type (`BUY`, `RENT`, `COMMERCIAL`), physical specifications (beds, baths, sq ft, year built), JSON amenities array, and views counter.
3. **PropertyImage**: Child relation to Property with cascade deletion, image URLs, alt text, primary display flag, and ordering index.
4. **Enquiry**: Connects customer leads with optional Property relations. Supports workflow statuses (`NEW`, `CONTACTED`, `IN_PROGRESS`, `CLOSED`, `SPAM`) and private internal notes.
5. **SiteSetting**: Key-value pairs for concierge telephone, WhatsApp international number, office headquarters address, and automated WhatsApp prefill templates.

---

## 4. Setup & Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ recommended)
- **npm**: v9.0.0 or higher
- Optional: **MySQL 8.0+** (if running in MySQL mode)

### Step 1: Install Dependencies
Run from the root repository directory:

```bash
# Install root orchestration tools
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

### Step 2: Database Setup & Seeding

Astrra Estates comes pre-configured with **zero-config SQLite mode** for instantaneous local development, as well as an official **MySQL schema** for production deployment.

#### Mode A: Zero-Config Local Development (Default - Ready Out-of-the-Box)
```bash
# Generate Prisma Client and sync dev.db
npm run db:push --prefix server

# Seed database with 16 properties, 12 enquiries, admin user & settings
npm run db:seed --prefix server
```

#### Mode B: MySQL Mode (Production Deployment)
1. In `server/.env`, configure your MySQL connection string:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/astreates"
   ```
2. Copy the MySQL schema:
   ```bash
   cp server/prisma/schema.mysql.prisma server/prisma/schema.prisma
   ```
3. Run migrations and seed:
   ```bash
   npm run db:push --prefix server
   npm run db:seed --prefix server
   ```

### Step 3: Run the Full-Stack Application

Run both the Express API and the Vite frontend simultaneously with a single root command:

```bash
npm run dev
```

- **Frontend Website:** `http://localhost:5173`
- **Backend REST API:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`

---

## 5. Demo Credentials & Administrative Access

To access the private Admin Control Desk:
1. Open `http://localhost:5173/admin` or click **Admin** in the header.
2. Enter the seeded administrator credentials:
   - **Email:** `admin@astreates.com`
   - **Password:** `AstrraAdmin2026!`
   *(A 1-click "Fill Credentials" button is provided on the login page for convenience)*

### Administrator Capabilities:
- **Live Metrics Dashboard:** Aggregate portfolio value, total published/draft/archived count, customer lead tally, and live activity stream.
- **Property Management:** Add new properties, edit specifications, upload/preview photo gallery URLs, toggle publication status (Publish / Unpublish), and feature listings on the homepage.
- **Customer Enquiry Management:** View submitted inquiries, filter by status, initiate 1-click WhatsApp or email client communications, update workflow status, and log private internal notes.
- **Site Settings Configuration:** Live update of concierge phone number, WhatsApp number, office address, and WhatsApp message templates without rebuilding.

---

## 6. Automated Testing Suite

Astrra Estates includes automated integration tests testing the REST API, Zod validations, rate limiting, and administrative authorization security.

### Running the Tests:
```bash
npm run test
```

### Test Results Report:
```
 ✓ src/__tests__/api.test.ts (13 tests) 405ms
   ✓ Health Check (1)
     ✓ should return healthy status
   ✓ Public Properties API (4)
     ✓ should retrieve list of published properties with pagination
     ✓ should filter properties by category BUY, RENT, and COMMERCIAL
     ✓ should retrieve single property by slug with images and related properties
     ✓ should return 404 for non-existent property
   ✓ Public Enquiries API (2)
     ✓ should reject enquiry with invalid email or phone
     ✓ should successfully submit valid customer enquiry
   ✓ Public Settings API (1)
     ✓ should return site contact information
   ✓ Admin Authorization Security (2)
     ✓ should reject unauthorized request without Bearer token
     ✓ should reject invalid administrative login credentials
   ✓ Admin Dashboard and Management Workflow (3)
     ✓ should calculate live metrics from database records
     ✓ should update enquiry status and persist private internal notes
     ✓ should toggle property status (publish / unpublish)

Test Files  1 passed (1)
Tests       13 passed (13)
Duration    1.04s
```

### End-to-End Browser Subagent Verification:
- **Primary Indian Market Walkthrough Recording:** `astreet_full_indian_market_test_1791964150362.webp` (Saved in IDE Artifacts)
- **Verified Workflows:**
  1. Homepage hero loaded with Indian luxury branding, Gateway Market cards (Worli, Lutyens, Indiranagar, North Goa, Jubilee Hills, Mandwa-Alibaug).
  2. Multi-criteria search executed for location/keyword *"Worli"*, returning *"The Aurelia Sky Penthouse"*.
  3. Filtered listing navigation to *"The Aurelia Sky Penthouse"* dossier displaying price in Crores (`₹ 45 Cr / ₹ 45,00,00,000`), "RERA Verified Title" badge, and architectural photography carousel.
  4. Submitted customer enquiry for *"Aditya Birla"* (`aditya.b@birla-holdings.in`), generating database reference `ENQ-9058`.
  5. Navigated to Admin Control Desk, authenticated with `admin@astreates.com`.
  6. Verified real-time portfolio metrics (Total value in Crores: `₹ 634.3 Cr`, 16 properties, 13 enquiries).
  7. Opened enquiry `ENQ-9058`, changed workflow status to `IN_PROGRESS`, added private internal note: *"High-priority investor lead. Scheduled private architectural walkthrough for tomorrow 4 PM IST."*, and saved successfully.

---

## 7. REST API Endpoints Reference

### Public Endpoints:
- `GET  /api/health` — API health check
- `GET  /api/properties` — Paginated property list with search, filter, and sorting
- `GET  /api/properties/featured` — Featured properties for the homepage
- `GET  /api/properties/locations/list` — Distinct cities with published listings
- `GET  /api/properties/:slugOrId` — Single property dossier with gallery and related items
- `POST /api/enquiries` — Submit customer viewing / acquisition enquiry (Rate-limited)
- `GET  /api/settings` — Public business touchpoints (Phone, WhatsApp, Office address)

### Protected Admin Endpoints (Require `Authorization: Bearer <JWT>`):
- `POST /api/admin/auth/login` — Administrator session login (Rate-limited)
- `GET  /api/admin/auth/me` — Current authenticated administrator profile
- `GET  /api/admin/dashboard/metrics` — Aggregated real database metrics
- `GET  /api/admin/properties` — Admin property list (all statuses)
- `GET  /api/admin/properties/:id` — Retrieve property for editing
- `POST /api/admin/properties` — Create new property listing
- `PUT  /api/admin/properties/:id` — Full property update
- `PATCH /api/admin/properties/:id/status` — Quick status toggle (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
- `PATCH /api/admin/properties/:id/featured` — Toggle homepage featured flag
- `DELETE /api/admin/properties/:id` — Delete property listing
- `GET  /api/admin/enquiries` — Paginated enquiries with status filter and search
- `GET  /api/admin/enquiries/:id` — View enquiry detail and associated estate
- `PATCH /api/admin/enquiries/:id` — Update status and private internal notes
- `DELETE /api/admin/enquiries/:id` — Delete customer enquiry
- `GET  /api/admin/settings` — Retrieve full site settings
- `PUT  /api/admin/settings` — Update global site settings

---

## 8. Known Limitations & Future Enhancements

1. **Direct File Upload to Cloud Storage:** Currently, property images are supplied via direct high-resolution URLs. A production enhancement would be integrating AWS S3 / Cloudinary for direct multi-file drag-and-drop file uploads.
2. **Automated Email & SMS Dispatch:** Inquiry confirmation emails can be wired directly to SendGrid or AWS SES.
3. **Multi-Currency Converter:** Real-time FX conversion for EUR, GBP, AED, and USD.
4. **Interactive 3D Virtual Tours:** Embedding Matterport 3D WebGL canvases directly inside property detail pages.

---

## 9. License & Attribution

Created for **ASTRRA TECH** by Antigravity Senior Full-Stack Engineering.  
All demonstration listings and photography are sourced under open-access architectural showcases.
#   A s t r a E s t a t e  
 