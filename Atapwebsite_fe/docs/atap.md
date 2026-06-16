Saya ingin membuat project website pemesanan menu cafe/resto berbasis web, tetapi tampilan utama untuk pelanggan harus sangat mobile-friendly karena customer cafe akan membuka menu lewat HP melalui QR code di meja.

Buatkan project dengan standar struktur yang rapi, scalable, dan siap dikembangkan.

Konsep aplikasi:
- Website ordering system untuk cafe/resto.
- Customer scan QR code di meja.
- Customer membuka halaman menu di browser HP.
- Customer bisa melihat kategori menu, memilih produk, membuka detail produk, menambahkan catatan, mengatur jumlah item, lalu masuk ke keranjang.
- Tampilan utama harus seperti mobile app walaupun sebenarnya website.
- Admin/staff nantinya bisa mengelola menu, kategori, meja, dan pesanan.
- Fokus awal adalah tampilan customer mobile ordering.

Style UI yang saya inginkan:
- Nuansa warm cafe, premium, clean, dan modern.
- Warna utama: coklat, cream, putih, beige, dan aksen hijau untuk tombol konfirmasi.
- Layout mobile dengan lebar seperti layar HP, bukan layout desktop penuh.
- Desktop hanya sebagai container/preview, tetapi konten utama tetap mobile centered.
- Gunakan desain seperti aplikasi mobile:
  - header compact
  - logo cafe di atas
  - hero section
  - card informasi cafe
  - card nomor meja
  - dropdown kategori
  - grid menu 2 kolom
  - bottom cart bar atau floating cart
  - popup detail menu
- Font terlihat premium dan nyaman dibaca.
- Banyak rounded corner.
- Soft shadow.
- Spacing rapi.
- Gambar menu harus terlihat besar dan menarik.

Halaman yang dibutuhkan:

1. Landing / Welcome Page
- Background image cafe dengan overlay gelap/coklat.
- Logo cafe besar di tengah.
- Text: "Bertemu di [Nama Cafe]"
- Tombol "Order Sekarang".
- Setelah klik, masuk ke halaman menu.

2. Menu Page
- Header atas:
  - logo cafe
  - link kecil: Home
  - icon keranjang
- Hero text:
  - "Tempat terbaik untuk bertemu dan menikmati."
- Card info cafe:
  - Nama cafe
  - Status buka
  - Jam buka
- Card meja:
  - "Meja Anda"
  - Nomor meja, contoh: "IN-01"
- Dropdown kategori:
  - Semua
  - Minuman
  - Makanan
  - Snack
- Section "People love this!"
- Product grid 2 kolom:
  - gambar produk
  - nama produk
  - harga
  - tombol "+ Tambah"
- Section "Semua Menu"
- Jika kategori dipilih, tampilkan hanya produk kategori tersebut.

3. Product Detail Popup / Bottom Sheet
Saat user klik produk:
- Muncul popup detail produk.
- Gambar produk besar.
- Nama produk.
- Harga.
- Deskripsi singkat.
- Input catatan, placeholder: "Contoh: less sugar, no ice..."
- Stepper quantity:
  - tombol minus
  - angka jumlah
  - tombol plus
- Total order.
- Tombol "Add Orderan - RpXX.XXX"
- Popup harus mobile-friendly dan terlihat seperti bottom sheet.

4. Cart Page / Cart Drawer
- Daftar item yang sudah ditambahkan.
- Bisa ubah quantity.
- Bisa hapus item.
- Bisa lihat subtotal.
- Input catatan pesanan jika perlu.
- Tombol "Checkout".

5. Checkout Page
- Ringkasan pesanan.
- Nomor meja.
- Total harga.
- Tombol "Kirim Pesanan".
- Setelah berhasil, tampilkan halaman sukses:
  - "Pesanan berhasil dikirim"
  - "Silakan tunggu, pesanan sedang diproses"

Data dummy menu:
Gunakan data dummy berikut:

Kategori:
- Semua
- Minuman
- Makanan
- Snack

Menu Minuman:
1. Air Mineral
   Harga: Rp5.000
   Deskripsi: Air mineral dingin dan segar.
2. Atap Coffee
   Harga: Rp24.000
   Deskripsi: Kopi signature dengan rasa creamy dan bold.
3. Kopi Susu
   Harga: Rp18.000
   Deskripsi: Kopi susu segar dengan pilihan level gula dan suhu.
4. Jus Jeruk
   Harga: Rp15.000
   Deskripsi: Jus jeruk segar dengan rasa manis alami.
5. Teh Tarik
   Harga: Rp10.000
   Deskripsi: Teh tarik creamy dengan aroma teh yang kuat.
6. Americano
   Harga: Rp20.000
   Deskripsi: Kopi hitam klasik dengan rasa bold.

Menu Makanan:
1. Nasi Goreng
   Harga: Rp25.000
   Deskripsi: Nasi goreng spesial dengan topping lengkap.

Menu Snack:
1. Mix Platter
   Harga: Rp35.000
   Deskripsi: Aneka snack goreng cocok untuk sharing.

Fitur penting:
- Customer tidak perlu login.
- Nomor meja diambil dari query URL, contoh:
  /menu?table=IN-01
- Jika tidak ada query table, gunakan default "IN-01".
- Cart disimpan sementara di localStorage.
- Format harga menggunakan Rupiah.
- UI harus responsive, tetapi prioritas utama mobile.
- Di desktop, tampilkan mobile layout di tengah layar dengan max-width sekitar 430px.
- Jangan buat tampilan desktop biasa untuk halaman customer.
- Pastikan pengalaman user seperti memakai aplikasi mobile.

Tech stack yang saya inginkan:
- Next.js dengan TypeScript.
- Tailwind CSS.
- React state management sederhana dulu, boleh pakai useState/useReducer.
- Struktur folder feature-based.
- Gunakan komponen yang bersih dan reusable.
- Jangan semua logic ditaruh di satu file besar.

Struktur project yang saya mau:

src/
|-- app/
|   |-- page.tsx
|   |-- menu/
|   |   `-- page.tsx
|   |-- cart/
|   |   `-- page.tsx
|   `-- checkout/
|       `-- page.tsx
|
|-- features/
|   `-- ordering/
|       |-- components/
|       |-- data/
|       |-- hooks/
|       |-- types/
|       |-- utils/
|       `-- index.ts
|
|-- components/
|   |-- ui/
|   `-- layout/
|
|-- lib/
|-- utils/
`-- types/

Komponen yang perlu dibuat:
- MobileShell
- WelcomePage
- MenuPage
- MenuHeader
- MenuHero
- CafeInfoCard
- TableCard
- CategorySelect
- ProductGrid
- ProductCard
- ProductDetailSheet
- CartButton
- CartPage
- CheckoutPage
- SuccessState
- QuantityStepper

Aturan coding:
- Gunakan TypeScript type yang jelas.
- Pisahkan data dummy menu di file tersendiri.
- Pisahkan helper format Rupiah.
- Jangan hardcode semua di komponen utama.
- Buat UI clean dan production-ready.
- Buat animasi ringan jika memungkinkan, misalnya saat popup muncul.
- Pastikan tombol mudah ditekan di layar HP.
- Gunakan semantic HTML.
- Pastikan tidak ada error TypeScript.

Output yang saya mau:
1. Buatkan struktur file project.
2. Buatkan semua kode yang dibutuhkan.
3. Jelaskan cara menjalankan project.
4. Pastikan hasil UI mirip dengan referensi:
   - welcome page cafe mobile
   - menu page mobile
   - kategori menu
   - card produk 2 kolom
   - popup detail produk
   - cart dan checkout sederhana

Prioritas:
- UI harus mirip referensi gambar.
- Mobile-first.
- Clean code.
- Mudah dikembangkan menjadi sistem cafe ordering lengkap.