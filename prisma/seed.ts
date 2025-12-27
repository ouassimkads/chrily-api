import {
  PrismaClient,
  User,
  Store,
  Category,
  Product,
  StoreCategory,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // ======================
  // 🧹 CLEAN DATABASE
  // ======================
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  // ======================
  // 👤 USERS
  // ======================
  const users: User[] = [];

  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        phone: `06${faker.number.int({ min: 10000000, max: 99999999 })}`,
        password: 'password123',
        address: faker.location.streetAddress(),
        role: 'user',
      },
    });

    users.push(user);

    await prisma.cart.create({
      data: { userId: user.id },
    });
  }

  // ======================
  // 🏪 STORES
  // ======================
  const stores: Store[] = [];
  const storeCategories = Object.values(StoreCategory);

  for (let i = 0; i < 3; i++) {
    const store = await prisma.store.create({
      data: {
        name: faker.company.name(),
        description: faker.company.catchPhrase(),
        imageUrl: faker.image.url(),
        address: faker.location.streetAddress(),
        phone: `05${faker.number.int({ min: 10000000, max: 99999999 })}`,
        isActive: true,
        category: faker.helpers.arrayElement(storeCategories),
      },
    });

    stores.push(store);
  }

  // ======================
  // 🗂 CATEGORIES
  // ======================
  const categories: Category[] = [];

  for (const store of stores) {
    for (let i = 0; i < 3; i++) {
      const category = await prisma.category.create({
        data: {
          name: faker.commerce.department(),
          storeId: store.id,
          imageUrl: faker.image.url(),
          isAvailable: true,
        },
      });

      categories.push(category);
    }
  }

  // ======================
  // 📦 PRODUCTS
  // ======================
  const products: Product[] = [];

  for (const category of categories) {
    for (let i = 0; i < 5; i++) {
      const product = await prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.number.float({ min: 100, max: 3000 }),
          imageUrl: faker.image.url(),
          isAvailable: true,
          categoryId: category.id,
          storeId: category.storeId,
        },
      });

      products.push(product);
    }
  }

  // ======================
  // 📦 ORDERS
  // ======================
  for (let i = 0; i < 5; i++) {
    const user = faker.helpers.arrayElement(users);
    const store = faker.helpers.arrayElement(stores);
    const orderProducts = faker.helpers.arrayElements(products, 2);

    let totalPrice = 0;

    const order = await prisma.order.create({
      data: {
        phoneNumber: user.phone,
        deliveryPrice: 200,
        totalPrice: 0,
        finalPrice: 0,
        paymentMethod: 'cash_on_delivery',
        status: 'pending',
        storeId: store.id,
        userId: user.id,
      },
    });

    for (const product of orderProducts) {
      totalPrice += product.price;

      await prisma.orderItem.create({
        data: {
          quantity: faker.number.int({ min: 1, max: 3 }),
          price: product.price,
          orderId: order.id,
          productId: product.id,
        },
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        totalPrice,
        finalPrice: totalPrice + 200,
      },
    });
  }

  console.log('✅ Seeding completed successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
