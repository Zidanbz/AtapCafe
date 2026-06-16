# Universal Project Setup Standard

Dokumen ini adalah standar struktur project untuk semua project baru agar konsisten, mudah dipelihara, mudah di-scale, dan mudah dipahami oleh developer lain.

Gunakan dokumen ini sebagai referensi utama saat membuat project baru, menambah fitur, mengubah struktur folder, atau melakukan refactor.

---

## Tujuan Dokumen

Dokumen ini bertujuan untuk:

1. Menyamakan standar struktur folder semua project.
2. Mempermudah onboarding developer baru.
3. Mempermudah pencarian file saat ingin mengubah fitur.
4. Menjaga pemisahan tanggung jawab antar folder.
5. Menghindari file besar yang sulit dirawat.
6. Membuat project siap dikembangkan dalam jangka panjang.

---

## Root Project

Struktur dasar project:

```text
project-name/
|-- apps/
|-- packages/
|-- docs/
|-- scripts/
|-- .env
|-- .env.example
|-- .gitignore
|-- README.md
|-- architecture.md
|-- summarize.md
`-- project-folder-guide.md
```

`apps/`
: Berisi aplikasi utama, misalnya frontend, backend, admin panel, mobile app, worker, atau service lain.

`packages/`
: Berisi package reusable yang bisa dipakai lintas aplikasi, misalnya shared types, UI components, config, helper, atau utility.

`docs/`
: Berisi dokumentasi project, catatan teknis, API docs, keputusan arsitektur, dan referensi tambahan.

`scripts/`
: Berisi script development, automation, seed database, migration helper, backup, atau script lain yang membantu proses development.

`.env`
: File konfigurasi lokal. Berisi credential, secret key, URL database, API key, dan konfigurasi sensitif lain. File ini tidak boleh di-commit.

`.env.example`
: Contoh konfigurasi environment yang aman dibagikan.

`.gitignore`
: Daftar file dan folder yang tidak boleh masuk git, seperti `node_modules`, `.env`, build output, cache, dan file sensitif.

`README.md`
: Dokumentasi utama project. Berisi deskripsi project, cara install, cara menjalankan, dan informasi penting untuk developer.

`architecture.md`
: Catatan arsitektur, prinsip teknis, flow sistem, dan keputusan penting dalam project.

`summarize.md`
: Handoff terbaru untuk chat baru atau developer lain. Baca file ini sebelum lanjut coding.

`project-folder-guide.md`
: Peta folder project. Menjelaskan fungsi setiap folder dan file penting.

---

## Contoh Struktur Monorepo

Gunakan struktur ini jika project memiliki lebih dari satu aplikasi.

```text
project-name/
|-- apps/
|   |-- web/
|   |-- api/
|   |-- admin/
|   `-- worker/
|
|-- packages/
|   |-- ui/
|   |-- config/
|   |-- shared-types/
|   `-- utils/
|
|-- docs/
|-- scripts/
|-- .env.example
|-- README.md
|-- architecture.md
|-- summarize.md
`-- project-folder-guide.md
```

`apps/web/`
: Aplikasi frontend utama.

`apps/api/`
: Aplikasi backend utama.

`apps/admin/`
: Aplikasi admin panel jika ada.

`apps/worker/`
: Background worker, queue processor, cron job, atau service asinkron.

`packages/ui/`
: Komponen UI reusable.

`packages/config/`
: Konfigurasi bersama, seperti ESLint config, TypeScript config, Prettier config, atau Tailwind config.

`packages/shared-types/`
: TypeScript type yang dipakai bersama antara frontend dan backend.

`packages/utils/`
: Helper dan utility yang benar-benar reusable lintas aplikasi.

---

## Contoh Struktur Single App

Gunakan struktur ini jika project hanya terdiri dari satu aplikasi.

```text
project-name/
|-- src/
|-- public/
|-- docs/
|-- scripts/
|-- .env
|-- .env.example
|-- .gitignore
|-- package.json
|-- README.md
|-- architecture.md
|-- summarize.md
`-- project-folder-guide.md
```

`src/`
: Source code utama.

`public/`
: Asset publik yang bisa diakses langsung dari browser.

`docs/`
: Dokumentasi tambahan project.

`scripts/`
: Script development dan automation.

---

# Backend Standard

Gunakan struktur ini untuk backend.

```text
api/
|-- src/
|   |-- app.ts
|   |-- server.ts
|   |-- config/
|   |-- database/
|   |-- middlewares/
|   |-- modules/
|   |-- routes/
|   `-- shared/
|
|-- docs/
|-- scripts/
|-- tests/
|-- .env
|-- .env.example
|-- .gitignore
|-- package.json
`-- tsconfig.json
```

`src/`
: Source code backend utama.

`app.ts`
: Setup aplikasi backend, seperti middleware, CORS, JSON parser, route utama, not found handler, dan error handler.

`server.ts`
: Titik start server. File ini membaca konfigurasi port dan menjalankan aplikasi.

`config/`
: Konfigurasi environment, validasi env, constant backend, dan konfigurasi global.

`database/`
: Koneksi database, pool, ORM setup, migration config, transaction helper, dan database utility.

`middlewares/`
: Middleware global backend, seperti auth middleware, error handler, validation middleware, rate limiter, dan not found handler.

`modules/`
: Folder utama untuk domain atau fitur backend.

`routes/`
: Route aggregator global. Menghubungkan semua route module ke aplikasi utama.

`shared/`
: Helper global backend yang bisa dipakai oleh banyak module.

`docs/`
: Dokumentasi backend.

`scripts/`
: Script khusus backend, seperti seed, migration helper, atau data generator.

`tests/`
: Unit test, integration test, dan test helper.

---

## Backend Layer Standard

Gunakan pola layer berikut:

```text
Request
↓
Route
↓
Controller
↓
Validator
↓
Service
↓
Repository
↓
Database / External API
```

Aturan utama:

1. Jangan taruh SQL di controller.
2. Jangan taruh business logic besar di controller.
3. Jangan panggil database langsung dari route.
4. Jangan taruh logic UI di backend.
5. Repository hanya fokus pada akses data.
6. Service fokus pada workflow dan business rule.
7. Controller fokus menerima request dan mengirim response.
8. Validator fokus memvalidasi input.

---

## Backend Modules

Semua domain backend diletakkan di dalam folder `modules/`.

Contoh:

```text
src/modules/
|-- auth/
|-- users/
|-- products/
|-- orders/
|-- payments/
`-- notifications/
```

`auth/`
: Login, register, session, token, forgot password, dan permission.

`users/`
: User profile, data user, update user, dan user management.

`products/`
: Data produk, kategori produk, stok, dan detail produk.

`orders/`
: Order, checkout, status order, dan riwayat order.

`payments/`
: Payment gateway, invoice, callback, refund, dan settlement.

`notifications/`
: Email, push notification, WhatsApp, atau in-app notification.

---

## Struktur Backend Feature

Setiap feature backend mengikuti struktur berikut:

```text
feature-name/
|-- feature-name.controller.ts
|-- feature-name.service.ts
|-- feature-name.repository.ts
|-- feature-name.validator.ts
|-- feature-name.mapper.ts
|-- feature-name.types.ts
`-- feature-name.routes.ts
```

`controller`
: Menerima request, mengambil query/body/params, memanggil service, dan mengirim response.

`service`
: Menyimpan business logic, workflow, validasi bisnis, dan orchestration antar repository.

`repository`
: Menyimpan query database, ORM query, atau akses external data source.

`validator`
: Validasi request body, params, dan query.

`mapper`
: Mengubah data dari database menjadi response yang rapi.

`types`
: TypeScript type untuk payload, query, DTO, row database, dan response.

`routes`
: Daftar endpoint milik feature tersebut.

---

## Contoh Backend Feature

```text
src/modules/orders/
|-- orders.controller.ts
|-- orders.service.ts
|-- orders.repository.ts
|-- orders.validator.ts
|-- orders.mapper.ts
|-- orders.types.ts
`-- orders.routes.ts
```

Contoh tanggung jawab:

`orders.controller.ts`
: Endpoint untuk membuat order, melihat detail order, dan membatalkan order.

`orders.service.ts`
: Logic checkout, validasi stok, kalkulasi total, dan pengecekan status order.

`orders.repository.ts`
: Query order, order item, payment status, dan update database.

`orders.validator.ts`
: Validasi payload create order, update status, dan filter order.

`orders.mapper.ts`
: Format response order agar aman dikirim ke frontend.

`orders.types.ts`
: Type untuk order payload, order row, order response, dan status order.

---

## Backend Shared Folder

```text
src/shared/
|-- errors/
|-- responses/
|-- constants/
|-- helpers/
|-- logger/
`-- types/
```

`errors/`
: Custom error class dan error utility.

`responses/`
: Response formatter agar semua API punya format konsisten.

`constants/`
: Constant global backend.

`helpers/`
: Helper umum backend.

`logger/`
: Setup logging.

`types/`
: Type global backend.

---

## Backend Config Folder

```text
src/config/
|-- env.ts
|-- app.config.ts
|-- database.config.ts
`-- cors.config.ts
```

`env.ts`
: Membaca dan memvalidasi environment variable.

`app.config.ts`
: Konfigurasi aplikasi.

`database.config.ts`
: Konfigurasi database.

`cors.config.ts`
: Konfigurasi CORS.

---

# Frontend Standard

Gunakan struktur ini untuk frontend.

```text
web/
|-- public/
|-- src/
|   |-- app/
|   |-- assets/
|   |-- components/
|   |-- constants/
|   |-- features/
|   |-- hooks/
|   |-- lib/
|   |-- providers/
|   |-- services/
|   |-- stores/
|   |-- types/
|   `-- utils/
|
|-- .env
|-- .env.example
|-- .gitignore
|-- package.json
`-- tsconfig.json
```

`public/`
: File publik statis yang bisa diakses langsung dari browser.

`src/`
: Source code frontend utama.

`app/`
: Route aplikasi. Untuk Next.js, ini adalah App Router. File route sebaiknya tipis dan memanggil komponen dari `features/`.

`assets/`
: Asset yang di-import langsung oleh aplikasi, seperti gambar, ikon, ilustrasi, dan file visual.

`components/`
: Komponen global yang reusable lintas feature.

`constants/`
: Konstanta global frontend.

`features/`
: Logic domain frontend. Semua fitur utama diletakkan di sini.

`hooks/`
: Hook global yang reusable lintas feature.

`lib/`
: Setup library global, seperti query client, formatter, auth client, atau helper library.

`providers/`
: Provider React global, seperti Theme Provider, Query Provider, Auth Provider, atau Store Provider.

`services/`
: Service global seperti axios instance, fetch client, atau API base client.

`stores/`
: Global state management.

`types/`
: Type global frontend.

`utils/`
: Utility global yang reusable lintas feature.

---

## Frontend Feature Based Structure

Semua fitur frontend diletakkan di dalam folder `features/`.

Contoh:

```text
src/features/
|-- auth/
|-- dashboard/
|-- users/
|-- products/
|-- orders/
`-- settings/
```

Setiap feature mengikuti struktur berikut:

```text
feature-name/
|-- api/
|-- components/
|-- config/
|-- hooks/
|-- stores/
|-- types/
|-- utils/
`-- index.ts
```

`api/`
: Fungsi panggil API backend, query key, dan request function.

`components/`
: Komponen UI khusus feature tersebut.

`config/`
: Konfigurasi form, field, label, opsi enum, table column, tab config, dan metadata tampilan.

`hooks/`
: Hook khusus feature, termasuk query, mutation, form state, dan local workflow.

`stores/`
: State khusus feature jika diperlukan.

`types/`
: Type domain khusus feature.

`utils/`
: Helper khusus feature.

`index.ts`
: Barrel export agar feature bisa di-import dari satu pintu.

---

## Contoh Frontend Feature

```text
src/features/orders/
|-- api/
|   |-- ordersApi.ts
|   `-- ordersQueryKeys.ts
|
|-- components/
|   |-- OrderList.tsx
|   |-- OrderDetail.tsx
|   |-- OrderStatusBadge.tsx
|   `-- OrderFilter.tsx
|
|-- config/
|   |-- orderStatusOptions.ts
|   `-- orderTableColumns.ts
|
|-- hooks/
|   |-- useOrders.ts
|   |-- useOrderDetail.ts
|   `-- useCreateOrder.ts
|
|-- types/
|   `-- order.types.ts
|
|-- utils/
|   |-- formatOrderStatus.ts
|   `-- calculateOrderTotal.ts
|
`-- index.ts
```

---

# Naming Convention

## Folder

Gunakan `kebab-case`.

Contoh:

```text
patient-history
queue-dashboard
payment-service
user-management
```

## Component File

Gunakan `PascalCase`.

Contoh:

```text
UserProfileCard.tsx
OrderDetailModal.tsx
PaymentStatusBadge.tsx
```

## Hook File

Gunakan `camelCase` dan diawali `use`.

Contoh:

```text
useUserProfile.ts
useOrderDetail.ts
usePaymentStatus.ts
```

## Type File

Gunakan nama domain dan suffix `.types.ts`.

Contoh:

```text
user.types.ts
order.types.ts
payment.types.ts
```

## API File

Gunakan nama domain dan suffix `Api.ts`.

Contoh:

```text
userApi.ts
orderApi.ts
paymentApi.ts
```

## Config File

Gunakan nama domain dan tujuan config.

Contoh:

```text
userTableColumns.ts
orderStatusOptions.ts
paymentMethodOptions.ts
```

---

# Type Standard

Jangan membuat satu file `types.ts` besar untuk semua type.

Hindari:

```text
types.ts
```

Gunakan struktur seperti ini:

```text
types/
|-- auth.types.ts
|-- user.types.ts
|-- product.types.ts
|-- order.types.ts
`-- payment.types.ts
```

Aturan:

1. Type dipisah berdasarkan domain.
2. Payload request dan response harus jelas.
3. Type database row sebaiknya dipisah dari type response.
4. Jangan pakai `any` kecuali benar-benar diperlukan.
5. Gunakan union type untuk status atau enum value.
6. Export type dari `index.ts` jika sering dipakai lintas file.

---

# API Response Standard

Gunakan format response API yang konsisten.

Contoh sukses:

```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": {}
}
```

Contoh error:

```json
{
  "success": false,
  "message": "Data tidak ditemukan",
  "errors": []
}
```

Aturan:

1. Semua response sukses memakai format yang sama.
2. Semua response error memakai format yang sama.
3. Jangan mengirim stack trace ke frontend.
4. Jangan mengirim data sensitif.
5. Gunakan HTTP status code yang sesuai.

---

# Environment Standard

Gunakan `.env.example` sebagai template.

Contoh backend:

```env
APP_PORT=3001
APP_ENV=development
DATABASE_URL=
JWT_SECRET=
CORS_ORIGIN=http://localhost:3000
```

Contoh frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Aturan:

1. `.env` tidak boleh di-commit.
2. `.env.example` wajib ada.
3. Secret tidak boleh hardcoded di source code.
4. Variable frontend yang expose ke browser harus diawali prefix sesuai framework, misalnya `NEXT_PUBLIC_`.
5. Semua env backend harus divalidasi saat aplikasi start.

---

# State Management Standard

Gunakan state berdasarkan kebutuhan.

## Local State

Gunakan untuk state kecil di satu component.

Contoh:

```text
useState
useReducer
```

## Server State

Gunakan untuk data dari API.

Contoh:

```text
React Query
SWR
```

## Global State

Gunakan hanya jika state dipakai lintas banyak feature.

Contoh:

```text
Zustand
Redux Toolkit
Jotai
```

Aturan:

1. Jangan semua state dimasukkan ke global store.
2. Data dari API sebaiknya dikelola oleh server state library.
3. Form state sebaiknya tetap dekat dengan form.
4. Global store hanya untuk state lintas halaman atau lintas feature.

---

# Component Standard

Pisahkan component berdasarkan tanggung jawab.

Contoh:

```text
components/
|-- layout/
|-- ui/
|-- feedback/
|-- form/
`-- navigation/
```

`layout/`
: Layout global seperti sidebar, navbar, page container.

`ui/`
: Komponen UI kecil seperti button, input, badge, card, modal.

`feedback/`
: Loading, empty state, error state, toast, alert.

`form/`
: Komponen form global yang reusable.

`navigation/`
: Komponen navigasi.

Aturan:

1. Component global hanya untuk komponen yang benar-benar reusable.
2. Component khusus feature tetap disimpan di folder feature.
3. Jangan menaruh business logic besar di component.
4. Jika component terlalu besar, pecah menjadi section kecil.
5. Jika component memiliki banyak state, pertimbangkan membuat custom hook.

---

# Hook Standard

Gunakan hook untuk memisahkan logic dari UI.

Contoh:

```text
hooks/
|-- useDebounce.ts
|-- useDisclosure.ts
`-- usePagination.ts
```

Aturan:

1. Hook global harus reusable lintas feature.
2. Hook khusus feature simpan di folder feature.
3. Hook API query simpan di feature terkait.
4. Jangan buat hook terlalu umum jika hanya dipakai satu tempat.

---

# Utility Standard

Gunakan `utils/` untuk helper murni.

Contoh:

```text
utils/
|-- formatDate.ts
|-- formatCurrency.ts
|-- parseError.ts
`-- cn.ts
```

Aturan:

1. Utility tidak boleh punya side effect besar.
2. Utility sebaiknya pure function.
3. Utility global hanya untuk helper yang dipakai lintas feature.
4. Helper khusus domain simpan di feature terkait.

---

# Documentation Standard

Minimal dokumentasi project:

```text
docs/
|-- api.md
|-- database.md
|-- deployment.md
|-- decisions.md
`-- troubleshooting.md
```

`api.md`
: Dokumentasi endpoint API.

`database.md`
: Dokumentasi tabel, relasi, migration, dan seed.

`deployment.md`
: Cara deploy project.

`decisions.md`
: Catatan keputusan teknis penting.

`troubleshooting.md`
: Masalah umum dan cara mengatasinya.

---

# Tempat Edit Berdasarkan Kebutuhan

## Tambah Endpoint Backend

1. Buat atau ubah feature di `src/modules`.
2. Tambahkan validator.
3. Tambahkan controller.
4. Tambahkan service.
5. Tambahkan repository jika perlu akses database.
6. Tambahkan route.
7. Hubungkan route ke route aggregator.
8. Tambahkan API client di frontend.
9. Tambahkan type frontend.
10. Tambahkan UI jika diperlukan.

## Ubah Query Database

Edit file:

```text
repository
```

Jangan taruh query database di:

```text
controller
service frontend
component
```

## Ubah Business Logic

Edit file:

```text
service
```

Contoh:

```text
orders.service.ts
payments.service.ts
users.service.ts
```

## Ubah Validasi Request

Edit file:

```text
validator
```

Contoh:

```text
orders.validator.ts
users.validator.ts
payments.validator.ts
```

## Ubah Response API

Cek file:

```text
mapper
service
types
```

Jika response berubah, update juga type frontend.

## Ubah Tampilan UI

Edit file:

```text
feature/components
```

Contoh:

```text
src/features/orders/components/OrderList.tsx
```

## Ubah Form

Cek folder:

```text
feature/components
feature/config
feature/hooks
feature/types
```

## Ubah API Frontend

Edit file:

```text
feature/api
```

Contoh:

```text
src/features/orders/api/ordersApi.ts
```

## Ubah Type Frontend

Edit file:

```text
feature/types
```

Contoh:

```text
src/features/orders/types/order.types.ts
```

## Tambah Asset

Jika asset publik:

```text
public/
```

Jika asset di-import oleh component:

```text
src/assets/
```

## Tambah Dokumentasi

Jika dokumentasi lintas project:

```text
docs/
```

Jika dokumentasi backend-only:

```text
api/docs/
```

Jika dokumentasi frontend-only:

```text
web/docs/
```

---

# Refactor Rules

Lakukan refactor jika:

1. File lebih dari 500 baris.
2. Satu file punya lebih dari satu tanggung jawab besar.
3. Component terlalu banyak state.
4. Service terlalu banyak workflow yang berbeda.
5. Repository terlalu banyak query dari domain berbeda.
6. Type file terlalu besar.
7. Folder sulit dicari.
8. Banyak duplicate logic.
9. Banyak hardcoded value.
10. Logic sering berubah tapi tersebar di banyak tempat.

---

# Anti Pattern

Hindari:

1. SQL di controller.
2. API call langsung dari banyak component tanpa layer API.
3. Semua type dikumpulkan dalam satu file besar.
4. Component terlalu besar.
5. Business logic di component.
6. Hardcoded URL.
7. Hardcoded secret.
8. Folder `misc`, `common`, atau `helpers` yang isinya campur semua.
9. Terlalu cepat membuat abstraction.
10. Mengubah struktur folder tanpa update dokumentasi.

---

# Commit Checklist

Sebelum commit, pastikan:

```text
[ ] Typecheck berhasil
[ ] Lint berhasil
[ ] Build berhasil
[ ] Tidak ada console/debug tidak perlu
[ ] Tidak ada hardcoded secret
[ ] Tidak ada file .env yang ikut commit
[ ] Tidak ada data sensitif
[ ] API response tetap konsisten
[ ] Type frontend sudah sesuai response backend
[ ] Dokumentasi di-update jika struktur berubah
```

---

# Setup Checklist Project Baru

Gunakan checklist ini saat membuat project baru.

```text
[ ] Buat folder root project
[ ] Buat README.md
[ ] Buat architecture.md
[ ] Buat summarize.md
[ ] Buat project-folder-guide.md
[ ] Buat .env.example
[ ] Setup .gitignore
[ ] Setup frontend jika dibutuhkan
[ ] Setup backend jika dibutuhkan
[ ] Setup docs/
[ ] Setup scripts/
[ ] Setup formatter
[ ] Setup linter
[ ] Setup typecheck
[ ] Setup build script
[ ] Setup struktur feature
[ ] Setup response formatter
[ ] Setup error handler
[ ] Setup env validation
[ ] Setup API client frontend
[ ] Setup folder types
[ ] Setup folder config
```

---

# Prinsip Utama

Gunakan prinsip berikut di semua project:

1. Feature first.
2. Domain driven.
3. Separation of concern.
4. Mudah dicari lebih penting daripada terlihat pintar.
5. Jangan campur business logic dengan UI.
6. Jangan campur database logic dengan controller.
7. Jangan membuat abstraction terlalu awal.
8. Konsisten lebih penting daripada preferensi pribadi.
9. Dokumentasi harus ikut berubah saat struktur berubah.
10. Project harus mudah dilanjutkan oleh developer lain.

---

# Standar Final

Semua project baru harus punya minimal:

```text
README.md
architecture.md
summarize.md
project-folder-guide.md
.env.example
docs/
scripts/
src/ atau apps/
```

Jika project memiliki frontend dan backend, gunakan struktur:

```text
project-name/
|-- apps/
|   |-- web/
|   `-- api/
|
|-- packages/
|-- docs/
|-- scripts/
|-- README.md
|-- architecture.md
|-- summarize.md
`-- project-folder-guide.md
```

Jika project hanya satu aplikasi, gunakan struktur:

```text
project-name/
|-- src/
|-- docs/
|-- scripts/
|-- README.md
|-- architecture.md
|-- summarize.md
`-- project-folder-guide.md
```

Selesai.
