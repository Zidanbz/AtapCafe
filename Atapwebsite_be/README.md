# Atap Website Backend

Backend scaffold untuk Atap Website.

Database lokal memakai MySQL + Prisma.

## Menjalankan

```bash
npm install
npm run dev
```

Default port: `4000`.

Health check:

```text
http://localhost:4000/health
```

Health check database:

```text
http://localhost:4000/health/database
```

## Setup MySQL Lokal

1. Buat database MySQL:

```sql
CREATE DATABASE atap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Sesuaikan `.env`:

```env
PORT=4000
DATABASE_URL="mysql://root:password@localhost:3306/atap_db"
```

3. Jalankan migration dan seed:

```bash
npm run db:migrate -- --name init
npm run db:seed
```

## Script

- `npm run dev` menjalankan server TypeScript dengan watch mode.
- `npm run build` compile TypeScript ke `dist`.
- `npm run start` menjalankan hasil build.
- `npm run typecheck` mengecek TypeScript tanpa emit.
- `npm run db:generate` generate Prisma Client.
- `npm run db:migrate` menjalankan migration Prisma ke MySQL lokal.
- `npm run db:seed` mengisi data awal Atap.
- `npm run db:studio` membuka Prisma Studio.

## Endpoint Awal

- `GET /health`
- `GET /health/database`
- `GET /api/categories`
- `GET /api/menu`
- `GET /api/menu?category=minuman`
- `POST /api/orders`
- `GET /api/admin/orders`

Contoh membuat order:

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "content-type: application/json" \
  -d '{
    "tableCode": "IN-01",
    "paymentMethod": "QRIS",
    "items": [
      {
        "menuItemId": "ISI_DENGAN_ID_MENU_ITEM",
        "quantity": 2,
        "note": "less sugar"
      }
    ]
  }'
```
