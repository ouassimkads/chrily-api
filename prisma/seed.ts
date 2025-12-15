// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // ----------------------------
  // Users
  // ----------------------------
  const user1 = await prisma.user.create({
    data: {
      name: 'Ali Nazim',
      email: 'ali@example.com',
      phone: '0790000001',
      password: 'password123',
      address: 'Skikda, Algeria',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Sara Ben',
      email: 'sara@example.com',
      phone: '0790000002',
      password: 'password123',
      address: 'Annaba, Algeria',
    },
  });

  // ----------------------------
  // Stores
  // ----------------------------
  const store1 = await prisma.store.create({
    data: {
      name: 'Nazim Electronics',
      description: 'متجر إلكترونيات',
      address: 'Skikda City',
      phone: '0791111111',
      imageUrl: 'image/store1.png',
    },
  });

  const store2 = await prisma.store.create({
    data: {
      name: 'Fast Food Nazim',
      description: 'مطعم وجبات سريعة',
      address: 'Skikda Center',
      phone: '0792222222',
      imageUrl: 'image/store2.png',
    },
  });

  // ----------------------------
  // Categories
  // ----------------------------
  const category1 = await prisma.category.create({
    data: {
      name: 'إلكترونيات',
      storeId: store1.id,
      imageUrl: 'image/electronics.png',
    },
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'هواتف',
      storeId: store1.id,
      imageUrl: 'image/phones.png',
    },
  });

  const category3 = await prisma.category.create({
    data: {
      name: 'وجبات سريعة',
      storeId: store2.id,
      imageUrl: 'image/fastfood.png',
    },
  });

  // ----------------------------
  // Products
  // ----------------------------
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop HP',
      description: 'Laptop for daily use',
      price: 450.5,
      categoryId: category1.id,
      storeId: store1.id,
      imageUrl: 'image/laptop.png',
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'iPhone 14',
      description: 'Newest iPhone model',
      price: 1200,
      categoryId: category2.id,
      storeId: store1.id,
      imageUrl: 'image/iphone14.png',
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Burger',
      description: 'Delicious beef burger',
      price: 5.5,
      categoryId: category3.id,
      storeId: store2.id,
      imageUrl: 'image/burger.png',
    },
  });

  // ----------------------------
  // Cart & CartItems
  // ----------------------------
  const cart1 = await prisma.cart.create({
    data: {
      userId: user1.id,
      items: {
        create: [
          { productId: product1.id, quantity: 1 },
          { productId: product2.id, quantity: 2 },
        ],
      },
    },
  });

  const cart2 = await prisma.cart.create({
    data: {
      userId: user2.id,
      items: {
        create: [{ productId: product3.id, quantity: 3 }],
      },
    },
  });

  // ----------------------------
  // Orders & OrderItems
  // ----------------------------
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      phoneNumber: user1.phone,
      totalPrice: 2850.5,
      deliveryPrice: 10,
      finalPrice: 2860.5,
      paymentMethod: 'cash_on_delivery',
      status: 'pending',
      items: {
        create: [
          { productId: product1.id, quantity: 1, price: product1.price },
          { productId: product2.id, quantity: 2, price: product2.price },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: user2.id,
      phoneNumber: user2.phone,
      totalPrice: 16.5,
      deliveryPrice: 2,
      finalPrice: 18.5,
      paymentMethod: 'cash_on_delivery',
      status: 'preparing',
      items: {
        create: [
          { productId: product3.id, quantity: 3, price: product3.price },
        ],
      },
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
