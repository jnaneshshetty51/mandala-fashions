# Mandala Fashions

## Production checklist

Before exposing the store to the public, make sure the following are in place:

- Use a supported Node.js runtime. This project should be deployed on Node 20 or Node 22 LTS. Node 24 is not supported for the custom server entrypoint.
- PostgreSQL is running and `DATABASE_URL` points to the production database.
- Prisma migrations have been applied with `npm run prisma:migrate`.
- `AUTH_SECRET` has been replaced with a long random private value.
- `NEXT_PUBLIC_APP_URL` points to the public site URL.
- MinIO or S3-compatible object storage is configured for uploads.
- Razorpay live keys are configured from the admin settings screen.
- The readiness probe `GET /api/ready` returns `200 OK`.

## Local development

```bash
nvm use 22
npm install
npm run prisma:generate
npm run dev
```

If you only need to preview the Next.js website locally on a machine that cannot run the custom Express server, use:

```bash
npm run dev:web
```

This starts the frontend directly without the custom Express API layer.

## Notes

- `/api/health` reports basic process health.
- `/api/ready` checks database and storage readiness for deployment environments.
- Orders are now only accepted for real database-backed products with available inventory.

A full-stack starter for a fashion storefront using:

- Next.js 15 for the website
- Express as the Node.js backend server
- PostgreSQL via Prisma
- MinIO for object storage

## Quick Start

1. Copy `.env.example` to `.env`.
2. Start infrastructure:

   ```bash
   docker compose up -d
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate the Prisma client and create the database schema:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

The app will be available on `http://localhost:3000`.

## API Endpoints

- `GET /api/health`
- `GET /api/products`
- `POST /api/products`
- `POST /api/uploads`

## Example Product Payload

```json
{
  "name": "Handloom Indigo Jacket",
  "description": "Structured outerwear with lightweight comfort and artisan detailing.",
  "price": 149.00,
  "imageUrl": "http://127.0.0.1:9000/mandala-assets/sample.jpg"
}
```
