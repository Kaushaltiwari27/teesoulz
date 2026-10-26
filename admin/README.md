# TEESOULZ — Core Administrative Platform

An independent, production-grade Next.js administrative application built for the **TEESOULZ** fashion e-commerce ecosystem.

## Key Capabilities

- **Catalog Management**: Full garment lifecycle (creation, editing, soft-deletion, image galleries, and pricing).
- **Variant & Inventory Matrix**: Real-time SKU tracking with size/color combinations and stock depletion warnings.
- **Fulfillment & Dispatch**: Customer order timeline, courier carrier tracking (AWB), and status updating.
- **Taxonomy & Drops**: Dedicated Category and Collection Drop managers.
- **Homepage & Visual Builder**: Dynamic 3D hero slides and editorial campaign banner editors.
- **Marketing & Promotions**: Percentage and flat discount code generator with minimum cart threshold validation.
- **Content & Tickers**: Live announcement marquee messages, manifesto copy, and customer review curation.
- **Persistent Media Library**: Connected directly to Supabase Storage `product-images` bucket.
- **Security & RBAC**: Supabase Auth gate with PostgreSQL Row Level Security (`role IN ('ADMIN', 'STAFF')`).
- **Audit Logging**: Real-time chronological audit trail of all administrative mutations.

---

## Deployment on Vercel (Independent Application)

1. Open the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Select your repository: `Kaushaltiwari27/teesoulz`.
3. In **Project Settings**:
   - **Project Name**: `teesoulz-admin`
   - **Framework Preset**: Next.js
   - **Root Directory**: Click `Edit` and select `admin`.
4. Add the following **Environment Variables** in Vercel:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
   NEXT_PUBLIC_SITE_URL=https://teesoulz-admin.vercel.app
   NEXT_PUBLIC_STOREFRONT_URL=https://teesoulz.vercel.app
   ```
5. Click **Deploy**.

---

## Local Development

```bash
cd admin
npm install
npm run dev
```

Admin dashboard opens at `http://localhost:3000`.
