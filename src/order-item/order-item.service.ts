import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class orderItemService {
  constructor(
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  async findByOrderId(orderId: number) {
    return this.prisma.orderItem.findMany({
      where: { orderId },
    });
  }

  async addNewItemToOrderById(data: {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    productOptionId?: number | null;
  }) {
    // تحقق أن الطلب موجود
    const order = await this.prisma.order.findUnique({
      where: { id: data.orderId },
    });
    if (!order) {
      throw new NotFoundException('الطلب غير موجود');
    }

    // تحقق أن المنتج موجود
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });
    if (!product) {
      throw new NotFoundException('المنتج غير موجود');
    }

    // أضف العنصر
    return this.prisma.orderItem.create({
      data: {
        orderId: data.orderId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
        productOptionId: data.productOptionId || null,
      },
    });
  }

  //TODO: Update item on specific order
  async updateItem(
    itemId: number,
    data: { quantity?: number; price?: number },
  ) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException('Order item not found');

    const updatedItem = await this.prisma.orderItem.update({
      where: { id: itemId },
      data,
    });
    await this.orderService.recalculateOrderPrice(item.orderId);
    return updatedItem;
  }

  //TODO: remove items from order
  async removeItem(itemId: number) {
    const item = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
    });
    if (!item) throw new NotFoundException('Order item not found');

    const deletedItem = await this.prisma.orderItem.delete({
      where: { id: itemId },
    });

    //? recalculate the total price
    await this.orderService.recalculateOrderPrice(item.orderId);

    return deletedItem;
  }

  //TODO: add items to order
  async addItemToOrder(
    orderId: number,
    data: { productId: number; quantity: number; price: number },
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const newItem = await this.prisma.orderItem.create({
      data: {
        orderId,
        productId: data.productId,
        quantity: data.quantity,
        price: data.price,
      },
    });

    //? recalculate the total price
    await this.orderService.recalculateOrderPrice(orderId);

    return newItem;
  }
}
