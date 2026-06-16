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
