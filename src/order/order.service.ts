import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Order, OrderItem } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  // إنشاء طلب جديد مع العناصر
  async createOrder(
    userId: number,
    items: { productId: number; quantity: number; price: number }[],
    deliveryPrice: number,
    paymentMethod: string = 'cash_on_delivery',
  ): Promise<Order> {
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const finalPrice = totalPrice + deliveryPrice;

    return this.prisma.order.create({
      data: {
        userId,
        totalPrice,
        deliveryPrice,
        finalPrice,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    });
  }

  // جلب كل الطلبات لمستخدم معين
  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // جلب طلب واحد مع العناصر
  async getOrderById(orderId: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  }
}
