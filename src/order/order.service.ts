import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  //TODO: CREATE NEW ORDER WITH THIS JSON BOLOW
  /**
   * 
      {
        "userId": 1,
        "deliveryPrice": 5,
        "paymentMethod": "cash_on_delivery",
        "items": [
          { "productId": 29, "quantity": 2, "price": 10 },
          { "productId": 30, "quantity": 1, "price": 20 }
        ]
      }
   */
  async createOrder(
    phoneNumber: string,
    items: { productId: number; quantity: number }[],
    deliveryPrice: number,
    paymentMethod: string = 'cash_on_delivery',
    storeId: number,
    userId?: number,
  ) {
    if (!phoneNumber) throw new BadRequestException('Phone number is required');

    const productIds = items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException('Items must be a non-empty array');
    }
    // إنشاء order items مع السعر الصحيح من جدول المنتجات
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product)
        throw new NotFoundException(`Product ${item.productId} not found`);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });
    //! caculate total of Items of the order
    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    //! add delivery Price to the total price to finale price
    const finalPrice = totalPrice + deliveryPrice;

    //? create the order with ptisma
    const order = await this.prisma.order.create({
      data: {
        userId, // يمكن أن يكون undefined
        phoneNumber,
        totalPrice,
        deliveryPrice,
        finalPrice,
        paymentMethod,
        storeId,
        items: { create: orderItems },
      },
      include: { items: true },
    });
    return { orderId: order.id };
  }

  /**
   * THAT USED FOR CONTROLLER getOrders
   * for gat all the orders and use pagination
   *
   */

  //TODO: RETURN CETAIN NUMBER OF ORDERS (WITH PAGINATION)
  async findAll(pagination: { skip: number; take: number }) {
    return this.prisma.order.findMany({
      skip: pagination.skip,
      take: pagination.take,
      include: {
        items: {
          include: {
            product: true, // جلب بيانات المنتج
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  //TODO/ RETURN TOTAL NUMBER OF ORDER ON ORDER TABLE
  async countAll() {
    return this.prisma.order.count();
  }

  //TODO: return the order with all the items for her
  async findByIdWithItems(orderId: number) {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });
  }

  //TODO: get all the order for specific user
  async findByUserId(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true }, // جلب العناصر المرتبطة بكل طلب
      orderBy: { id: 'desc' }, // ترتيب من الأحدث للأقدم
    });
  }

  //TODO: Update order by id
  // تحديث الطلب بواسطة ID
  async update(
    id: number,
    data: {
      totalPrice?: number;
      deliveryPrice?: number;
      finalPrice?: number;
      paymentMethod?: string;
      status?: OrderStatus;
    },
  ) {
    // إذا تم تعديل totalPrice أو deliveryPrice، يمكننا حساب finalPrice جديد
    if (data.totalPrice || data.deliveryPrice) {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Order not found');
      const newFinalPrice =
        (data.totalPrice ?? order.totalPrice) +
        (data.deliveryPrice ?? order.deliveryPrice);
      data.finalPrice = newFinalPrice;
    }

    // تحديث الطلب في قاعدة البيانات
    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  //TODO: remove order with items in it
  async remove(id: number) {
    return this.prisma.order.delete({
      where: { id: Number(id) },
    });
  }

  async updateStatus(orderId: number, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
  }

  async recalculateOrderPrice(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const totalPrice = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const finalPrice = totalPrice + order.deliveryPrice;

    return this.prisma.order.update({
      where: { id: orderId },
      data: { totalPrice, finalPrice },
    });
  }
}
