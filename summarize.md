# Atap Website Summary

Dokumen ini adalah handoff utama project. Baca file ini sebelum lanjut coding, lalu update setiap kali ada perubahan struktur, fitur, database, endpoint, atau keputusan arsitektur.

## Struktur Root

Root project hanya berisi dua aplikasi:

```text
AtapWebsite/
|-- Atapwebsite_fe/  # Frontend Next.js
`-- Atapwebsite_be/  # Backend Fastify + Prisma + MySQL
```

Jangan membuat folder `apps/` lagi. Struktur lama `apps/web` dan `apps/api` sudah tidak dipakai.

## Cara Menjalankan Project

Syarat lokal:

- Node.js dan npm sudah terpasang.
- MySQL server berjalan.
- Database `atap_db` sudah ada.
- File `Atapwebsite_be/.env` sudah berisi `DATABASE_URL` yang bisa login ke MySQL.

Setup database pertama kali:

```bash
cd Atapwebsite_be
npm install
npx prisma migrate deploy
npm run db:seed
```

Catatan: untuk setup lokal yang hanya memakai migration yang sudah ada, gunakan `npx prisma migrate deploy`. Command `npm run db:migrate` menjalankan `prisma migrate dev` dan butuh izin MySQL untuk membuat shadow database. Jika user database tidak punya izin `CREATE DATABASE`, `db:migrate` bisa gagal dengan error `P3014`.

Menjalankan backend:

```bash
cd Atapwebsite_be
npm run dev
```

Backend berjalan di:

```text
http://localhost:4000
```

Cek backend:

```bash
curl http://localhost:4000/health/database
curl http://localhost:4000/api/menu
```

Menjalankan frontend di terminal lain:

```bash
cd Atapwebsite_fe
npm install
npm run dev
```

Frontend berjalan di:

```text
http://localhost:3000
```

Halaman utama yang biasa dicek:

```text
http://localhost:3000/menu?table=IN-01
http://localhost:3000/admin
```

Admin seed default:

```text
username: admin
password: 123456
```

Jika ingin memakai `npm run db:migrate` untuk membuat migration baru, pastikan user MySQL punya izin membuat shadow database. Contoh untuk local dev:

```sql
GRANT ALL PRIVILEGES ON *.* TO 'atap_user'@'localhost';
FLUSH PRIVILEGES;
```

## Frontend

Lokasi:

```text
Atapwebsite_fe/
```

Stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- React state sederhana
- Customer UI tetap mobile-app style dengan `MobileShell`
- Admin UI memakai layout website penuh dan tetap responsive mobile

Route utama:

```text
/                         # Welcome customer
/menu?table=IN-01          # Menu customer
/cart?table=IN-01          # Cart customer
/checkout?table=IN-01      # Checkout customer
/admin                     # Admin password gate/dashboard
/admin/menu                # Admin menu management
/admin/orders              # Admin orders
/admin/password-gate       # Admin password gate settings
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

- Logo Atap memakai file asli dari desain: `public/images/logo-black.png` dan `public/images/logo-white.png`.
- Referensi desain asli ada di `Atapwebsite_fe/docs/reference/Atap Desain/`.
- Customer layout di desktop tetap container mobile centered.
- Admin layout di desktop harus website dashboard, bukan frame HP.
- Admin page yang sudah login memakai navigasi horizontal utama: Dashboard, Pesanan, Menu, Password.
- Form tambah/edit menu admin memakai upload file gambar + preview, bukan input URL manual. Frontend upload ke endpoint backend lalu menyimpan `imageUrl` hasil upload.

Menjalankan frontend:

```bash
cd Atapwebsite_fe
npm install
npm run dev
```

Verifikasi frontend:

```bash
npm run typecheck
npm run build
```

Frontend memakai backend API dari:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Jika env ini tidak diisi, frontend fallback ke `http://localhost:4000`.

## Backend

Lokasi:

```text
Atapwebsite_be/
```

Stack:

- Node.js
- TypeScript
- Fastify
- Prisma ORM
- Local MySQL

Folder penting:

```text
Atapwebsite_be/src/server.ts
Atapwebsite_be/src/app.ts
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
Atapwebsite_be/prisma/schema.prisma
Atapwebsite_be/prisma/seed.ts
```

Struktur utama backend sekarang mengikuti pola folder seperti referensi Firebase Functions, tapi disesuaikan untuk Fastify + Prisma + MySQL:

```text
Atapwebsite_be/
|-- src/
|   |-- app.ts
|   |-- server.ts
|   |-- config/
|   |   `-- database.ts          # Prisma Client untuk MySQL, pengganti firebase config
|   |-- controller/
|   |-- dto/
|   |-- entity/
|   |-- helper/
|   |-- middleware/
|   |-- repo/                    # semua query Prisma/MySQL
|   |-- routes/
|   |-- service/
|   |-- util/
|   `-- validator/
|-- prisma/
|   |-- schema.prisma            # schema database MySQL
|   `-- seed.ts
|-- package.json
`-- tsconfig.json
```

Catatan: tidak ada `firestore.indexes.json` atau `serviceAccountKey.json` karena backend ini tidak memakai Firebase. Koneksi database memakai `DATABASE_URL` MySQL di `.env` dan Prisma Client di `src/config/database.ts`.

Catatan CORS: backend mengizinkan `GET`, `HEAD`, `POST`, `PATCH`, `DELETE`, dan `OPTIONS`. Ini penting karena fitur admin menu/orders memakai `PATCH` dan `DELETE` dari frontend.

Upload gambar menu:

- Dependency backend: `@fastify/multipart`.
- Endpoint upload admin: `POST /api/admin/menu/image` dengan auth admin dan multipart field `image`.
- File disimpan lokal di `Atapwebsite_be/uploads/menu/`.
- File publik disajikan dari `GET /uploads/menu/:filename`.
- Maksimal file 5 MB, format yang diterima: JPG, PNG, WEBP, GIF.

Menjalankan backend:

```bash
cd Atapwebsite_be
npm install
npm run dev
```

Verifikasi backend:

```bash
npm test
npm run test:integration # butuh TEST_DATABASE_URL
npm run typecheck
npm run build
npm audit --audit-level=moderate
```

## Database

Database lokal:

```text
MySQL database: atap_db
```

Contoh `.env` backend:

```env
PORT=4000
DATABASE_URL="mysql://root@localhost:3306/atap_db"
ADMIN_AUTH_SECRET="ganti-dengan-secret-lokal"
```

Jika root MySQL memakai password:

```env
DATABASE_URL="mysql://root:password@localhost:3306/atap_db"
```

Setup awal database lewat MySQL root/admin:

```sql
CREATE DATABASE atap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'atap_user'@'localhost' IDENTIFIED BY 'atap_password';
GRANT ALL PRIVILEGES ON atap_db.* TO 'atap_user'@'localhost';
FLUSH PRIVILEGES;
```

Contoh `.env` jika memakai user project:

```env
DATABASE_URL="mysql://atap_user:atap_password@localhost:3306/atap_db"
```

Apply migration yang sudah ada dan seed:

```bash
cd Atapwebsite_be
npx prisma migrate deploy
npm run db:seed
```

Gunakan `npm run db:migrate -- --name nama_migration` hanya saat membuat migration baru. Command ini butuh permission MySQL untuk membuat shadow database, jadi user database harus punya izin `CREATE DATABASE` atau akses global yang cukup.

Seed membuat admin awal:

```text
username: admin
password: 123456
```

Password admin disimpan sebagai hash `scrypt`, bukan password mentah.

GUI database:

```bash
npm run db:studio
```

Prisma Studio biasanya terbuka di:

```text
http://localhost:5555
```

Model Prisma saat ini:

- `Category`
- `MenuItem`
- `DiningTable`
- `AdminUser`
- `Order`
- `OrderItem`
- `Payment`

## Endpoint Backend Saat Ini

Base local:

```text
http://localhost:4000
```

Endpoint:

```text
GET  /health
GET  /health/database
GET  /api/categories
GET  /api/menu
GET  /api/menu?category=minuman
POST /api/orders
POST /api/admin/auth/login
POST /api/admin/auth/refresh
GET  /api/admin/me
PATCH /api/admin/password
GET  /api/admin/stats
GET  /api/admin/menu
POST /api/admin/menu
PATCH /api/admin/menu/:id
DELETE /api/admin/menu/:id
GET  /api/admin/orders
GET  /api/admin/orders?page=1&take=10&dateFrom=2026-05-01&dateTo=2026-05-31
PATCH /api/admin/orders/:id/status
DELETE /api/admin/orders/:id
```

Endpoint admin selain login wajib memakai header:

```text
Authorization: Bearer <token_dari_login>
```

Contoh membuat order:

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "content-type: application/json" \
  -d '{
    "tableCode": "IN-01",
    "customerName": "Nama Pelanggan",
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

## Pola Coding Saat Ini

Backend memakai layered architecture berbasis folder global:

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
Prisma / MySQL
```

Tanggung jawab folder:

- `config`: konfigurasi aplikasi dan database. Saat ini berisi Prisma Client untuk MySQL.
- `routes`: daftar endpoint dan binding ke controller.
- `controller`: menerima request, ambil params/query/body, panggil service, return response.
- `validator`: validasi dan normalisasi input request.
- `service`: business logic dan workflow.
- `repo`: semua query Prisma/MySQL.
- `dto`: type request/response/input.
- `entity`: type entity/payload Prisma.
- `helper`: mapper response dan helper kecil seperti nomor order, table area, pagination.
- `middleware`: middleware Fastify seperti error handler.
- `util`: utility umum seperti `HttpError`.

File lama `src/modules/*`, `src/lib/prisma.ts`, dan `src/utils/http-error.ts` sudah dipindah ke struktur baru.

Frontend saat ini feature-based:

```text
src/features/ordering
src/features/admin
```

Route di `src/app` sebaiknya tipis dan hanya memanggil komponen feature.

Integrasi frontend saat ini:

- Customer menu mengambil data dari `GET /api/menu`.
- Checkout wajib mengisi nama pelanggan dan mengirim order ke `POST /api/orders`.
- Checkout customer saat ini hanya menyediakan pembayaran QRIS.
- Admin login memakai `POST /api/admin/auth/login`.
- Admin dashboard mengambil stats dari `GET /api/admin/stats`.
- Admin menu management berada di `/admin/menu` dan memakai endpoint CRUD `GET/POST/PATCH/DELETE /api/admin/menu`.
- Admin orders mengambil data paginated dari `GET /api/admin/orders?page=1&take=10`.
- Admin orders bisa update status order dan status pembayaran manual lewat `PATCH /api/admin/orders/:id/status`.
- Admin orders bisa filter tanggal lewat query `dateFrom` dan `dateTo`.
- Admin orders bisa hapus satu order lewat `DELETE /api/admin/orders/:id`.
- Sesi admin bisa diperpanjang lewat `POST /api/admin/auth/refresh`.
- Halaman password gate lama sekarang dipakai untuk update password admin via backend.

## Planning Refactor Layered Architecture

Target backend refactor:

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
Prisma / MySQL
```

Target struktur backend:

```text
src/
|-- config/
|-- controller/
|-- dto/
|-- entity/
|-- helper/
|-- middleware/
|-- repo/
|-- routes/
|-- service/
|-- util/
`-- validator/
```

Tanggung jawab:

- `routes`: daftar endpoint dan binding handler.
- `controller`: menerima request, ambil params/query/body, panggil service, return response.
- `validator`: validasi input request memakai validator ringan.
- `service`: business logic dan workflow.
- `repo`: semua query Prisma/MySQL.
- `helper`: mapper response dan helper umum.
- `dto`: type request/response/domain.

Prioritas refactor:

1. Selesai: pindahkan backend dari `src/modules/*` ke struktur global seperti referensi (`routes`, `controller`, `repo`, `service`, dll).
2. Selesai: database layer memakai `src/config/database.ts` dengan Prisma Client untuk MySQL.
3. Selesai: tambahkan validator request `POST /api/orders`.
4. Selesai: tambahkan mapper response untuk menu, orders, dan admin orders.
5. Selesai: admin order management dan dashboard stats sudah ada di layer global.
6. Selesai: sambungkan frontend customer ke endpoint `GET /api/menu`.
7. Selesai: sambungkan checkout customer ke `POST /api/orders`.
8. Selesai: sambungkan admin orders ke `GET /api/admin/orders`.
9. Selesai: tambahkan endpoint update status order.
10. Selesai: tambahkan auth admin berbasis backend token, bukan localStorage password gate.

Prioritas berikutnya:

1. Selesai: tambahkan delete order eksplisit. UI admin sekarang hapus per-order via backend.
2. Selesai: tambahkan refresh token sederhana via `POST /api/admin/auth/refresh`. Catatan produksi: bisa dinaikkan ke cookie httpOnly nanti.
3. Selesai: tambahkan test API awal untuk health, auth admin, create order validation, dan update status auth guard.
4. Selesai: tambahkan filter admin orders berdasarkan tanggal.

Prioritas lanjutan:

1. Selesai: tambahkan pagination backend untuk admin orders dan kontrol halaman di UI.
2. Selesai: tambahkan create/update/delete menu item untuk admin lewat `/admin/menu`.
3. Selesai sebagian: tambahkan status pembayaran manual dari admin. QRIS provider nyata belum diintegrasikan.
4. Selesai: tambahkan integration test yang memakai `TEST_DATABASE_URL` dan skip secara default.

Menjalankan integration test database:

```bash
cd Atapwebsite_be
TEST_DATABASE_URL="mysql://root@localhost:3306/atap_test_db" npm run test:integration
```

Script `test:integration` otomatis:

1. Membuat database dari `TEST_DATABASE_URL` jika belum ada.
2. Menjalankan `prisma db push` ke database test.
3. Menjalankan test integration.

Syaratnya MySQL server harus berjalan dan user di `TEST_DATABASE_URL` punya izin `CREATE DATABASE`.

Prioritas berikutnya:

1. Integrasi QRIS/payment gateway nyata.
2. Tambahkan migration/schema untuk refresh token persistent atau pindah auth ke cookie httpOnly.
3. Tambahkan upload gambar menu atau file manager, bukan hanya image URL.
4. Tambahkan pagination/filter/search untuk halaman admin menu.

## Aturan Update File Ini

Setiap kali ada perubahan penting, update `summarize.md`.

Wajib update jika:

- struktur folder berubah
- route frontend berubah
- endpoint backend bertambah/berubah
- schema database berubah
- script npm berubah
- dependency utama berubah
- pola arsitektur berubah
- fitur customer/admin bertambah
- ada instruksi setup baru

Jaga file ini tetap singkat, jelas, dan berguna untuk handoff Codex berikutnya.
