import "dotenv/config";
import { db, dateToFirestore, closeDatabase } from "../config/database";
import { AdminRole, OrderStatus, OrderType, PaymentMethod, PaymentStatus, TableStatus } from "../entity/domain.entity";
import { hashPassword } from "../helper/password.helper";

const categories = [
  { name: "Minuman", slug: "minuman", displayOrder: 1 },
  { name: "Makanan", slug: "makanan", displayOrder: 2 },
  { name: "Snack", slug: "snack", displayOrder: 3 },
];

const menuItems = [
  {
    categorySlug: "minuman",
    name: "Air Mineral",
    slug: "air-mineral",
    price: 5000,
    description: "Air mineral dingin dan segar.",
    imageUrl: "https://images.unsplash.com/photo-1616118132534-381148898bb4?auto=format&fit=crop&w=700&q=80",
    isFeatured: true,
  },
  {
    categorySlug: "minuman",
    name: "Atap Coffee",
    slug: "atap-coffee",
    price: 24000,
    description: "Kopi signature dengan rasa creamy dan bold.",
    imageUrl: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=80",
    isFeatured: true,
  },
  {
    categorySlug: "minuman",
    name: "Kopi Susu",
    slug: "kopi-susu",
    price: 18000,
    description: "Kopi susu segar dengan pilihan level gula dan suhu.",
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80",
    isFeatured: true,
  },
  {
    categorySlug: "minuman",
    name: "Jus Jeruk",
    slug: "jus-jeruk",
    price: 15000,
    description: "Jus jeruk segar dengan rasa manis alami.",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=700&q=80",
    isFeatured: true,
  },
  {
    categorySlug: "minuman",
    name: "Teh Tarik",
    slug: "teh-tarik",
    price: 10000,
    description: "Teh tarik creamy dengan aroma teh yang kuat.",
    imageUrl: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=700&q=80",
  },
  {
    categorySlug: "minuman",
    name: "Americano",
    slug: "americano",
    price: 20000,
    description: "Kopi hitam klasik dengan rasa bold.",
    imageUrl: "https://images.unsplash.com/photo-1494314671902-399b18174975?auto=format&fit=crop&w=700&q=80",
  },
  {
    categorySlug: "makanan",
    name: "Nasi Goreng",
    slug: "nasi-goreng",
    price: 25000,
    description: "Nasi goreng spesial dengan topping lengkap.",
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=80",
  },
  {
    categorySlug: "snack",
    name: "Mix Platter",
    slug: "mix-platter",
    price: 35000,
    description: "Aneka snack goreng cocok untuk sharing.",
    imageUrl: "https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?auto=format&fit=crop&w=700&q=80",
  },
];

function docId(slug: string) {
  return slug.replace(/[^a-z0-9-]/g, "-");
}

async function seedCategories(now: Date) {
  for (const category of categories) {
    await db
      .collection("categories")
      .doc(docId(category.slug))
      .set(
        {
          ...category,
          isActive: true,
          createdAt: dateToFirestore(now),
          updatedAt: dateToFirestore(now),
        },
        { merge: true },
      );
  }
}

async function seedMenuItems(now: Date) {
  for (const item of menuItems) {
    const categoryId = docId(item.categorySlug);

    await db
      .collection("menuItems")
      .doc(docId(item.slug))
      .set(
        {
          categoryId,
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: item.price,
          imageUrl: item.imageUrl,
          isAvailable: true,
          isFeatured: item.isFeatured ?? false,
          createdAt: dateToFirestore(now),
          updatedAt: dateToFirestore(now),
        },
        { merge: true },
      );
  }
}

async function seedTables(now: Date) {
  for (const code of ["IN-01", "IN-02", "IN2-01", "IN2-03", "OUT-01", "OUT-02"]) {
    await db
      .collection("diningTables")
      .doc(docId(code.toLowerCase()))
      .set(
        {
          code,
          area: code.startsWith("OUT") ? "Outdoor" : "Indoor",
          status: TableStatus.AVAILABLE,
          createdAt: dateToFirestore(now),
          updatedAt: dateToFirestore(now),
        },
        { merge: true },
      );
  }
}

async function seedAdmin(now: Date) {
  await db.collection("adminUsers").doc("admin").set(
    {
      name: "Admin Utama",
      username: "admin",
      passwordHash: hashPassword("123456"),
      role: AdminRole.OWNER,
      isActive: true,
      createdAt: dateToFirestore(now),
      updatedAt: dateToFirestore(now),
    },
    { merge: true },
  );
}

async function seedExampleOrder(now: Date) {
  const items = [
    {
      id: "seed-item-kopi-susu",
      orderId: "atap-001",
      menuItemId: "kopi-susu",
      nameSnapshot: "Kopi Susu",
      priceSnapshot: 18000,
      quantity: 2,
      note: null,
      subtotal: 36000,
      createdAt: dateToFirestore(now),
    },
    {
      id: "seed-item-nasi-goreng",
      orderId: "atap-001",
      menuItemId: "nasi-goreng",
      nameSnapshot: "Nasi Goreng",
      priceSnapshot: 25000,
      quantity: 1,
      note: null,
      subtotal: 25000,
      createdAt: dateToFirestore(now),
    },
  ];
  const total = 61000;

  await db.collection("orders").doc("atap-001").set(
    {
      orderNumber: "ATAP-001",
      tableId: "in-01",
      customerName: "Budi Santoso",
      customerContact: "08123456789",
      orderType: OrderType.DINE_IN,
      status: OrderStatus.COMPLETED,
      paymentStatus: PaymentStatus.PAID,
      subtotal: total,
      additionalCost: 0,
      total,
      orderNote: null,
      createdAt: dateToFirestore(now),
      updatedAt: dateToFirestore(now),
      items,
      payment: {
        id: "seed-payment-atap-001",
        orderId: "atap-001",
        method: PaymentMethod.QRIS,
        status: PaymentStatus.PAID,
        amount: total,
        paidAt: dateToFirestore(now),
        createdAt: dateToFirestore(now),
        updatedAt: dateToFirestore(now),
      },
    },
    { merge: true },
  );
}

async function main() {
  const now = new Date();

  await seedCategories(now);
  await seedMenuItems(now);
  await seedTables(now);
  await seedAdmin(now);
  await seedExampleOrder(now);

  console.log("Firestore seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDatabase();
  });
