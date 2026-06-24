# Atap Website

Website pemesanan menu cafe berbasis web. Project dipisah menjadi frontend dan backend scaffold.

Struktur root project:

```text
AtapWebsite/
|-- Atapwebsite_fe/
`-- Atapwebsite_be/
```

## Menjalankan Project

Frontend:

```bash
cd Atapwebsite_fe
npm install
npm run dev
```

Buka URL yang muncul di terminal, biasanya `http://localhost:3000`.

Contoh URL dengan nomor meja:

```text
http://localhost:3000/menu?table=IN-01
```

Halaman admin:

```text
http://localhost:3000/admin
```

Default password admin sementara: `123456`.

Backend:

```bash
cd Atapwebsite_be
npm install
npm run dev
```

Health check backend:

```text
http://localhost:4000/health
```

## Script

- Frontend: `npm run dev`, `npm run build`, `npm run typecheck`.
- Backend: `npm run dev`, `npm run build`, `npm run typecheck`.

## Deploy Frontend ke Vercel

Frontend dideploy dari folder `Atapwebsite_fe` dengan Root Directory Vercel `Atapwebsite_fe`.

Environment frontend yang perlu diisi di Vercel:

```env
NEXT_PUBLIC_API_URL="https://api-oemrkqzxdq-et.a.run.app"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="isi-client-key-midtrans-sandbox"
NEXT_PUBLIC_MIDTRANS_SNAP_URL="https://app.sandbox.midtrans.com/snap/snap.js"
```

Detail langkah deploy ada di `docs/vercel-deploy.md`.

## Struktur Utama

```text
Atapwebsite_fe/
|-- src/
|-- public/
`-- docs/

Atapwebsite_be/
`-- src/
```

Flow customer saat ini mencakup welcome page, menu, product bottom sheet, cart, checkout, dan success state. Admin mencakup password gate, dashboard, database pesanan, filter, hapus pesanan, dan halaman ubah password gate.
