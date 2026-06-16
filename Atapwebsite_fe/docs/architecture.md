# Architecture

Atap Website memakai struktur dua folder utama dengan frontend dan backend terpisah.

```text
Atapwebsite_fe
Atapwebsite_be
```

Frontend memakai Next.js App Router dengan TypeScript dan Tailwind CSS. Backend saat ini scaffold Node.js TypeScript dengan endpoint health.

## Prinsip

- Route web di `Atapwebsite_fe/src/app` dibuat tipis dan memanggil komponen feature.
- Domain ordering berada di `Atapwebsite_fe/src/features/ordering`.
- Domain admin berada di `Atapwebsite_fe/src/features/admin`.
- Backend berada di `Atapwebsite_be`.
- Data dummy dipisahkan dari komponen.
- Cart disimpan sementara di `localStorage`.
- Layout customer dikunci sebagai mobile shell dengan `max-width` sekitar layar HP.

## Ordering

```text
Atapwebsite_fe/src/features/ordering/
|-- components/
|-- data/
|-- hooks/
|-- types/
`-- utils/
```

`CartProvider` di `Atapwebsite_fe/src/features/ordering/hooks/useCart.tsx` mengelola item, catatan pesanan, subtotal, dan persistensi localStorage.

## Admin

```text
Atapwebsite_fe/src/features/admin/
|-- components/
|-- data/
`-- types/
```

Route admin:

- `/admin`
- `/admin/orders`
- `/admin/password-gate`

Admin memakai shell web penuh yang responsif. Layout customer ordering tetap memakai mobile shell tersendiri.
