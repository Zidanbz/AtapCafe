# Atap Website Summary

Dokumen ini adalah handoff utama project. Baca file ini sebelum lanjut coding, lalu update setiap ada perubahan struktur, fitur, database, endpoint, deploy, atau keputusan arsitektur.

## Status Terbaru

Project sudah dipindah dari Prisma/MySQL ke Firebase:

- Backend: Fastify + TypeScript + Firebase Admin SDK + Firestore.
- Deploy backend: Firebase Functions Gen 2, region `asia-southeast2`.
- Firebase project: `atapcafe-7909e`.
- Function URL backend: `https://api-oemrkqzxdq-et.a.run.app`.
- Frontend: Next.js App Router, sudah diarahkan ke backend Firebase Functions.
- Payment: Midtrans Sandbox Snap/QRIS sudah terintegrasi dan live test berhasil.

Catatan penting: Midtrans key pernah terlihat di screenshot/chat. Setelah selesai testing, rotate/regenerate key Midtrans Sandbox sebelum lanjut production.

## Struktur Root

Root project berisi dua aplikasi utama:

```text
AtapCafe/
|-- Atapwebsite_fe/  # Frontend Next.js
|-- Atapwebsite_be/  # Backend Fastify + Firebase Admin + Firestore + Functions
|-- firebase.json
|-- .firebaserc
`-- summarize.md
```

Jangan membuat folder `apps/` lagi. Struktur lama `apps/web` dan `apps/api` sudah tidak dipakai.

## Firebase

Firebase project yang dipakai:

```text
Project name: atapcafe
Project ID: atapcafe-7909e
Project number: 892400213834
Region Functions: asia-southeast2
Backend URL: https://api-oemrkqzxdq-et.a.run.app
```

Backend berjalan di Firebase Functions Gen 2 dengan export function `api`. Konfigurasi deploy ada di:

```text
firebase.json
.firebaserc
Atapwebsite_be/src/index.ts
```

`src/index.ts` memakai `app.inject()` untuk meneruskan request dari Firebase Functions ke Fastify. Ini penting: adapter lama dengan `app.server.emit('request', request, response)` membuat POST body timeout di Functions.

Deploy backend:

```bash
firebase deploy --only functions:backend --project atapcafe-7909e
```

## Environment

Backend env lokal/deploy dipisah:

```text
Atapwebsite_be/.env        # deploy-safe env, dibaca Firebase CLI saat deploy
Atapwebsite_be/.env.local  # local-only env untuk npm run dev
```

Contoh `Atapwebsite_be/.env` untuk deploy:

```env
ADMIN_AUTH_SECRET="ganti-dengan-secret"
MIDTRANS_IS_PRODUCTION="false"
MIDTRANS_SERVER_KEY="isi-server-key-midtrans-sandbox"
```

Contoh `Atapwebsite_be/.env.local` untuk lokal:

```env
PORT=4000
FIREBASE_PROJECT_ID="atapcafe-7909e"
FIREBASE_SERVICE_ACCOUNT_PATH="./serviceAccountKey.json"
FUNCTION_REGION="asia-southeast2"
ADMIN_AUTH_SECRET="ganti-dengan-secret"
MIDTRANS_IS_PRODUCTION="false"
MIDTRANS_SERVER_KEY="isi-server-key-midtrans-sandbox"
```

`serviceAccountKey.json` disimpan di `Atapwebsite_be/serviceAccountKey.json` untuk lokal saja dan harus tetap di-gitignore.

Frontend env:

```env
NEXT_PUBLIC_API_URL="https://api-oemrkqzxdq-et.a.run.app"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="isi-client-key-midtrans-sandbox"
NEXT_PUBLIC_MIDTRANS_SNAP_URL="https://app.sandbox.midtrans.com/snap/snap.js"
```

## Cara Menjalankan Lokal

Backend lokal:

```bash
cd Atapwebsite_be
npm install
npm run dev
```

Backend lokal berjalan di:

```text
http://localhost:4000
```

Cek backend:

```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/menu
```

Frontend lokal:

```bash
cd Atapwebsite_fe
npm install
npm run dev
```

Frontend berjalan di:

```text
http://localhost:3000
```

Testing di HP satu Wi-Fi tanpa deploy Vercel:

```bash
cd Atapwebsite_fe
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Buka dari HP, contoh:

```text
http://192.168.1.7:3000/menu?t=IN-01
```

`next.config.ts` sudah mengizinkan dev origin `192.168.1.7`.

## Frontend

Lokasi:

```text
Atapwebsite_fe/
```

Stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Customer UI mobile-app style dengan `MobileShell`
- Admin UI dashboard responsive
- Checkout customer punya pilihan pembayaran Cash dan Cashless.
- Cash membuat order `CASH` tanpa Midtrans lalu menampilkan instruksi menuju kasir.
- Cashless membuat order `QRIS` dan membuka Midtrans Snap JS.

Route utama:

```text
/                         # Welcome customer
/menu?t=IN-01             # Menu customer
/cart?t=IN-01             # Cart customer
/checkout?t=IN-01         # Checkout customer
/admin                    # Admin password gate/dashboard
/admin/menu               # Admin menu management
/admin/orders             # Admin orders
/admin/password-gate      # Admin password gate settings
```

Folder penting:

```text
Atapwebsite_fe/src/app
Atapwebsite_fe/src/components
Atapwebsite_fe/src/features/ordering
Atapwebsite_fe/src/features/admin
Atapwebsite_fe/public/images
Atapwebsite_fe/docs/reference/Atap Desain
```

Catatan desain:

- Logo Atap memakai `public/images/logo-black.png` dan `public/images/logo-white.png`.
- Customer layout desktop tetap container mobile centered.
- Admin layout desktop berupa dashboard penuh, bukan frame HP.
- Form tambah/edit menu admin memakai upload file gambar + preview.

Verifikasi frontend:

```bash
cd Atapwebsite_fe
npm run typecheck
npm run build
```

## Backend

Lokasi:

```text
Atapwebsite_be/
```

Stack:

- Node.js 22
- TypeScript
- Fastify
- Firebase Admin SDK
- Firestore
- Firebase Functions Gen 2
- Midtrans Snap API

Folder penting:

```text
Atapwebsite_be/src/index.ts        # Firebase Functions export api
Atapwebsite_be/src/server.ts       # local dev server
Atapwebsite_be/src/app.ts          # Fastify app builder
Atapwebsite_be/src/config/env.ts
Atapwebsite_be/src/config/database.ts
Atapwebsite_be/src/controller
Atapwebsite_be/src/dto
Atapwebsite_be/src/entity
Atapwebsite_be/src/helper
Atapwebsite_be/src/middleware
Atapwebsite_be/src/repo
Atapwebsite_be/src/routes
Atapwebsite_be/src/service
Atapwebsite_be/src/util
Atapwebsite_be/src/validator
Atapwebsite_be/src/scripts/seed-firestore.ts
```

Arsitektur backend:

```text
Request
↓
routes
↓
controller
↓
validator
↓
service
↓
repo
↓
Firestore
```

Catatan CORS: backend mengizinkan `GET`, `HEAD`, `POST`, `PATCH`, `DELETE`, dan `OPTIONS`.

Upload gambar menu:

- Dependency backend: `@fastify/multipart`.
- Endpoint upload admin: `POST /api/admin/menu/image` dengan auth admin dan multipart field `image`.
- File menu baru disimpan ke Firebase Storage bucket `atapcafe-7909e.firebasestorage.app`.
- Response upload mengembalikan Firebase Storage download URL dengan token, lalu URL itu disimpan sebagai `imageUrl` di Firestore.
- Endpoint legacy `GET /uploads/menu/:filename` masih ada, tetapi upload baru tidak lagi memakai local filesystem Firebase Functions.

Verifikasi backend:

```bash
cd Atapwebsite_be
npm run typecheck
npm run build
npm test
```

## Database

Database sekarang memakai Firestore di project Firebase `atapcafe-7909e`.

Collection utama:

- `categories`
- `menuItems`
- `diningTables`
- `adminUsers`
- `orders`

Order menyimpan embedded `items` dan `payment` di dokumen order.

Seed Firestore:

```bash
cd Atapwebsite_be
npm run db:seed
```

Admin seed default:

```text
username: admin
password: 123456
```

Password admin disimpan sebagai hash `scrypt`, bukan password mentah.

## Endpoint Backend

Base production:

```text
https://api-oemrkqzxdq-et.a.run.app
```

Base local:

```text
http://localhost:4000
```

Endpoint public/customer:

```text
GET  /health
GET  /health/database
GET  /api/categories
GET  /api/menu
GET  /api/menu?category=minuman
POST /api/orders
POST /api/payments/midtrans/notification
```

Endpoint admin:

```text
POST   /api/admin/auth/login
POST   /api/admin/auth/refresh
GET    /api/admin/me
PATCH  /api/admin/password
GET    /api/admin/stats
GET    /api/admin/menu
POST   /api/admin/menu
PATCH  /api/admin/menu/:id
DELETE /api/admin/menu/:id
POST   /api/admin/menu/image
GET    /api/admin/orders
GET    /api/admin/orders?page=1&take=10&dateFrom=2026-05-01&dateTo=2026-05-31
PATCH  /api/admin/orders/:id/status
DELETE /api/admin/orders/:id
```

Endpoint admin selain login wajib memakai header:

```text
Authorization: Bearer <token_dari_login>
```

Contoh membuat order CASH:

```bash
curl -X POST https://api-oemrkqzxdq-et.a.run.app/api/orders \
  -H "content-type: application/json" \
  -d '{
    "tableCode": "IN-01",
    "customerName": "Nama Pelanggan",
    "paymentMethod": "CASH",
    "items": [{ "menuItemId": "kopi-susu", "quantity": 1 }]
  }'
```

Contoh membuat order QRIS Midtrans:

```bash
curl -X POST https://api-oemrkqzxdq-et.a.run.app/api/orders \
  -H "content-type: application/json" \
  -d '{
    "tableCode": "IN-01",
    "customerName": "Nama Pelanggan",
    "paymentMethod": "QRIS",
    "items": [{ "menuItemId": "kopi-susu", "quantity": 1 }]
  }'
```

Response QRIS menyertakan:

```text
data.midtrans.token
data.midtrans.redirectUrl
data.midtrans.snapJsUrl
```

## Midtrans

Midtrans saat ini memakai Sandbox.

Backend:

- `Atapwebsite_be/src/service/midtrans.service.ts` membuat Snap transaction.
- `Atapwebsite_be/src/service/payments.service.ts` handle notification/callback.
- Server key hanya di backend env.

Frontend:

- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` dipakai untuk load Snap JS.
- Checkout QRIS memanggil `window.snap.pay(token)`.

Notification URL yang perlu diset di dashboard Midtrans Sandbox:

```text
https://api-oemrkqzxdq-et.a.run.app/api/payments/midtrans/notification
```

Live test terakhir berhasil:

```json
{
  "ok": true,
  "paymentStatus": "PENDING",
  "hasToken": true,
  "hasRedirect": true,
  "snapJsUrl": "https://app.sandbox.midtrans.com/snap/snap.js"
}
```

## Keputusan Penting

- Prisma/MySQL sudah tidak dipakai.
- Firebase Functions key env tidak boleh memakai prefix reserved `FIREBASE_` saat deploy. Untuk local-only boleh di `.env.local`, tapi deploy-safe `.env` harus bebas reserved key seperti `PORT`, `FIREBASE_PROJECT_ID`, `FUNCTION_REGION`.
- Adapter Functions ke Fastify harus memakai `app.inject()` supaya POST body tidak timeout.
- Cloud Run invoker sudah public (`roles/run.invoker` untuk `allUsers`), sehingga endpoint bisa diakses frontend.
- Secrets saat ini masih env plain. Nanti sebaiknya pindahkan `MIDTRANS_SERVER_KEY` dan `ADMIN_AUTH_SECRET` ke Firebase Functions Secrets/Secret Manager.

## Prioritas Lanjutan

1. Set Midtrans Notification URL di dashboard Sandbox.
2. Rotate/regenerate Midtrans keys setelah testing karena pernah terlihat.
3. Pindahkan secret backend ke Firebase Functions Secrets.
4. Siapkan mode production Midtrans: production server key, production client key, `MIDTRANS_IS_PRODUCTION=true`, dan production Snap URL.
5. Tambahkan test khusus create order QRIS yang mock Midtrans.
6. Review Firestore security/IAM, Firebase Storage IAM, dan backup data.

## Aturan Update File Ini

Setiap kali ada perubahan penting, update `summarize.md`.

Wajib update jika:

- struktur folder berubah
- route frontend berubah
- endpoint backend bertambah/berubah
- schema/collection database berubah
- script npm berubah
- dependency utama berubah
- pola arsitektur berubah
- fitur customer/admin bertambah
- setup/deploy/env berubah

Jaga file ini tetap singkat, jelas, dan berguna untuk handoff Codex berikutnya.
