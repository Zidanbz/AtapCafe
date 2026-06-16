import type { Category, Product } from "@/features/ordering/types/menu";

export const categories: Category[] = ["Semua", "Minuman", "Makanan", "Snack"];

export const products: Product[] = [
  {
    id: "air-mineral",
    name: "Air Mineral",
    category: "Minuman",
    price: 5000,
    description: "Air mineral dingin dan segar.",
    image: "https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=700&q=80",
    featured: true,
  },
  {
    id: "atap-coffee",
    name: "Atap Coffee",
    category: "Minuman",
    price: 24000,
    description: "Kopi signature dengan rasa creamy dan bold.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
    featured: true,
  },
  {
    id: "kopi-susu",
    name: "Kopi Susu",
    category: "Minuman",
    price: 18000,
    description: "Kopi susu segar dengan pilihan level gula dan suhu. Cocok untuk teman bersantai di atap.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
    featured: true,
  },
  {
    id: "jus-jeruk",
    name: "Jus Jeruk",
    category: "Minuman",
    price: 15000,
    description: "Jus jeruk segar dengan rasa manis alami.",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80",
    featured: true,
  },
  {
    id: "teh-tarik",
    name: "Teh Tarik",
    category: "Minuman",
    price: 10000,
    description: "Teh tarik creamy dengan aroma teh yang kuat.",
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "americano",
    name: "Americano",
    category: "Minuman",
    price: 20000,
    description: "Kopi hitam klasik dengan rasa bold.",
    image: "https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "nasi-goreng",
    name: "Nasi Goreng",
    category: "Makanan",
    price: 25000,
    description: "Nasi goreng spesial dengan topping lengkap.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "mix-platter",
    name: "Mix Platter",
    category: "Snack",
    price: 35000,
    description: "Aneka snack goreng cocok untuk sharing.",
    image: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=700&q=80",
  },
];
