# Deploy Frontend ke Vercel

Frontend Atap memakai Next.js App Router dan bisa langsung dideploy ke Vercel dari folder `Atapwebsite_fe`.

## Pengaturan Project Vercel

Saat import repository di Vercel, pakai pengaturan berikut:

```text
Root Directory: Atapwebsite_fe
Framework Preset: Next.js
Install Command: npm install
Build Command: npm run build
Output Directory: default
```

Jangan pilih root repository `AtapCafe` sebagai root app, karena `package.json` frontend ada di `Atapwebsite_fe`.

## Environment Variables

Tambahkan env berikut di Vercel Project Settings -> Environment Variables:

```env
NEXT_PUBLIC_API_URL="https://api-oemrkqzxdq-et.a.run.app"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="isi-client-key-midtrans-sandbox"
NEXT_PUBLIC_MIDTRANS_SNAP_URL="https://app.sandbox.midtrans.com/snap/snap.js"
```

Untuk sandbox Midtrans, pakai client key sandbox. Untuk production nanti, ganti ke client key production dan update `NEXT_PUBLIC_MIDTRANS_SNAP_URL` ke URL Snap production dari Midtrans.

## Verifikasi Sebelum Deploy

Jalankan dari folder frontend:

```bash
cd Atapwebsite_fe
npm run typecheck
npm run build
```

Jika dua command ini sukses, frontend siap dideploy.

## Setelah Deploy

Setelah Vercel memberi domain production, format URL meja menjadi:

```text
https://domain-vercel/menu?table=IN-01
```

Gunakan domain production ini saat generate QR meja.
