import "dotenv/config";
import { OrderStatus, OrderType, PaymentMethod, PaymentStatus, PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/helper/password.helper";

const prisma = new PrismaClient();

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

const seedOrders = [
  {
    orderNumber: "ATAP-001",
    customerName: "Budi Santoso",
    customerContact: "08123456789",
    tableCode: "IN-01",
    orderType: OrderType.DINE_IN,
    status: OrderStatus.COMPLETED,
    paymentMethod: PaymentMethod.QRIS,
    paymentStatus: PaymentStatus.PAID,
    time: "14:32",
    items: [
      { slug: "kopi-susu", quantity: 2 },
      { slug: "nasi-goreng", quantity: 1 },
    ],
  },
  {
    orderNumber: "ATAP-002",
    customerName: "Siti Rahayu",
    customerContact: null,
    tableCode: "IN2-03",
    orderType: OrderType.DINE_IN,
    status: OrderStatus.IN_PROCESS,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.UNPAID,
    time: "14:10",
    items: [
      { slug: "air-mineral", quantity: 3 },
      { slug: "mix-platter", quantity: 1 },
    ],
  },
  {
    orderNumber: "ATAP-003",
    customerName: "Andi Wijaya",
    customerContact: null,
    tableCode: "OUT-02",
    orderType: OrderType.TAKE_AWAY,
    status: OrderStatus.IN_PROCESS,
    paymentMethod: PaymentMethod.QRIS,
    paymentStatus: PaymentStatus.PENDING,
    time: "13:55",
    items: [
      { slug: "atap-coffee", quantity: 2 },
      { slug: "jus-jeruk", quantity: 1 },
    ],
  },
  {
    orderNumber: "ATAP-004",
    customerName: "Dewi Putri",
    customerContact: null,
    tableCode: "IN-02",
    orderType: OrderType.DINE_IN,
    status: OrderStatus.PENDING,
    paymentMethod: PaymentMethod.CASH,
    paymentStatus: PaymentStatus.UNPAID,
    time: "13:30",
    items: [{ slug: "teh-tarik", quantity: 2 }],
  },
  {
    orderNumber: "ATAP-005",
    customerName: "Rizal Fahmi",
    customerContact: null,
    tableCode: "IN2-01",
    orderType: OrderType.DINE_IN,
    status: OrderStatus.COMPLETED,
    paymentMethod: PaymentMethod.QRIS,
    paymentStatus: PaymentStatus.PAID,
    time: "13:15",
    items: [
      { slug: "kopi-susu", quantity: 1 },
      { slug: "nasi-goreng", quantity: 2 },
    ],
  },
  {
    orderNumber: "ATAP-006",
    customerName: "Maya Indah",
    customerContact: null,
    tableCode: "OUT-01",
    orderType: OrderType.TAKE_AWAY,
    status: OrderStatus.COMPLETED,
    paymentMethod: PaymentMethod.QRIS,
    paymentStatus: PaymentStatus.PAID,
    time: "12:48",
    items: [
      { slug: "air-mineral", quantity: 2 },
      { slug: "americano", quantity: 1 },
    ],
  },
];

function getTodayInMakassar() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function createSeedOrderDate(time: string) {
  return new Date(`${getTodayInMakassar()}T${time}:00.000+08:00`);
}

async function main() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const item of menuItems) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: item.categorySlug },
    });

    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        categoryId: category.id,
        name: item.name,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        isFeatured: item.isFeatured ?? false,
      },
      create: {
        categoryId: category.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
        description: item.description,
        imageUrl: item.imageUrl,
        isFeatured: item.isFeatured ?? false,
      },
    });
  }

  for (const code of ["IN-01", "IN-02", "IN2-01", "IN2-03", "OUT-01", "OUT-02"]) {
    await prisma.diningTable.upsert({
      where: { code },
      update: {},
      create: {
        code,
        area: code.startsWith("OUT") ? "Outdoor" : "Indoor",
      },
    });
  }

  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {
      passwordHash: hashPassword("123456"),
    },
    create: {
      name: "Admin Utama",
      username: "admin",
      passwordHash: hashPassword("123456"),
      role: "OWNER",
    },
  });

  for (const seedOrder of seedOrders) {
    const orderItems = await Promise.all(
      seedOrder.items.map(async (item) => {
        const menuItem = await prisma.menuItem.findUniqueOrThrow({
          where: { slug: item.slug },
        });

        return {
          menuItemId: menuItem.id,
          nameSnapshot: menuItem.name,
          priceSnapshot: menuItem.price,
          quantity: item.quantity,
          subtotal: menuItem.price * item.quantity,
        };
      }),
    );
    const subtotal = orderItems.reduce((total, item) => total + item.subtotal, 0);
    const createdAt = createSeedOrderDate(seedOrder.time);
    const table = await prisma.diningTable.findUniqueOrThrow({ where: { code: seedOrder.tableCode } });

    await prisma.order.upsert({
      where: { orderNumber: seedOrder.orderNumber },
      update: {
        tableId: table?.id ?? null,
        customerName: seedOrder.customerName,
        customerContact: seedOrder.customerContact,
        orderType: seedOrder.orderType,
        status: seedOrder.status,
        paymentStatus: seedOrder.paymentStatus,
        subtotal,
        additionalCost: 0,
        total: subtotal,
        orderNote: null,
        createdAt,
        items: {
          deleteMany: {},
          create: orderItems,
        },
        payment: {
          upsert: {
            update: {
              method: seedOrder.paymentMethod,
              status: seedOrder.paymentStatus,
              amount: subtotal,
              paidAt: seedOrder.paymentStatus === PaymentStatus.PAID ? createdAt : null,
            },
            create: {
              method: seedOrder.paymentMethod,
              status: seedOrder.paymentStatus,
              amount: subtotal,
              paidAt: seedOrder.paymentStatus === PaymentStatus.PAID ? createdAt : null,
            },
          },
        },
      },
      create: {
        orderNumber: seedOrder.orderNumber,
        tableId: table?.id ?? null,
        customerName: seedOrder.customerName,
        customerContact: seedOrder.customerContact,
        orderType: seedOrder.orderType,
        status: seedOrder.status,
        paymentStatus: seedOrder.paymentStatus,
        subtotal,
        additionalCost: 0,
        total: subtotal,
        orderNote: null,
        createdAt,
        items: {
          create: orderItems,
        },
        payment: {
          create: {
            method: seedOrder.paymentMethod,
            status: seedOrder.paymentStatus,
            amount: subtotal,
            paidAt: seedOrder.paymentStatus === PaymentStatus.PAID ? createdAt : null,
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Database seeded.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
