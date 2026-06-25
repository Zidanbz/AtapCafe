# Atap Website Backend

Backend API untuk Atap Website.

Database memakai Firebase Firestore melalui Firebase Admin SDK.
Upload gambar menu memakai Firebase Storage.

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

## Setup Firebase

1. Buat project di Firebase Console.
2. Aktifkan Firestore Database.
3. Aktifkan Firebase Storage.
4. Buat service account key di Project Settings -> Service accounts.
5. Salin nilai credential ke `.env`:

```env
PORT=4000
FIREBASE_PROJECT_ID="atap-cafe"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@atap-cafe.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
STORAGE_BUCKET="atap-cafe.firebasestorage.app"
ADMIN_AUTH_SECRET="change-this-secret"
```

Alternatif lokal: pakai `GOOGLE_APPLICATION_CREDENTIALS=/path/service-account.json` dan cukup isi `FIREBASE_PROJECT_ID`.

Seed data awal:

```bash
npm run db:seed
```

Admin default dari seed:

```text
username: admin
password: 123456
```

## Script

- `npm run dev` menjalankan server TypeScript dengan watch mode.
- `npm run build` compile TypeScript ke `dist`.
- `npm run start` menjalankan hasil build.
- `npm run typecheck` mengecek TypeScript tanpa emit.
- `npm test` menjalankan unit test.
- `npm run test:integration` menjalankan integration test Firebase jika env sudah siap.
- `npm run db:seed` mengisi data awal Firestore.

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
    "customerName": "Budi",
    "paymentMethod": "QRIS",
    "items": [
      {
        "menuItemId": "kopi-susu",
        "quantity": 2,
        "note": "less sugar"
      }
    ]
  }'
```

## Deploy ke Firebase Functions

Project Firebase default diset di `.firebaserc`:

```text
atapcafe-7909e
```

Backend diexport sebagai HTTP Function bernama `api`. Deploy dari root project:

```bash
firebase deploy --only functions:backend
```

URL API setelah deploy biasanya berbentuk:

```text
https://asia-southeast2-atapcafe-7909e.cloudfunctions.net/api
```

Untuk lokal, backend tetap bisa dijalankan seperti biasa:

```bash
cd Atapwebsite_be
npm run dev
```

Catatan: `serviceAccountKey.json` hanya untuk lokal dan tidak ikut deploy. Di Firebase Functions, kredensial Firestore otomatis memakai service account bawaan project.
Pastikan env `STORAGE_BUCKET` mengarah ke bucket Firebase Storage project yang sama.
