# Handoff Summary

Project Atap Website sudah dipisah menjadi dua folder utama.

Struktur:

- `Atapwebsite_fe`: Next.js + TypeScript + Tailwind CSS.
- `Atapwebsite_be`: backend TypeScript scaffold.

Fitur customer yang tersedia:

- Welcome page.
- Menu page mobile-first dengan kategori.
- Product detail bottom sheet.
- Cart page dengan update quantity, hapus item, subtotal, dan catatan.
- Checkout page dengan success state.
- Nomor meja dari query `?table=IN-01`, default `IN-01`.
- Cart persist ke localStorage.
- Logo memakai asset asli dari `Atapwebsite_fe/docs/reference/Atap Desain/Logo-black.png` dan `Atapwebsite_fe/docs/reference/Atap Desain/logo-white.png`.

Fitur admin yang tersedia:

- `/admin`: password gate dan dashboard admin.
- `/admin/orders`: database pesanan, search, filter modal, hapus semua.
- `/admin/password-gate`: ubah password gate.
- `/admin/menu`: kelola menu dengan upload gambar file + preview, bukan input URL manual.
- Admin memakai layout website penuh untuk desktop dan kartu responsif untuk mobile, tidak lagi memakai frame mobile customer.
- Admin yang sudah login memakai navigasi horizontal ke Dashboard, Pesanan, Menu, dan Password.

Default password admin: `123456`.

Referensi desain ada di folder `Atapwebsite_fe/docs/reference/Atap Desain/`.
