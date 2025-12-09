import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // =========================
  // Cart
  // =========================
  async createCart(userId: number) {
    return this.prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async getCartByUser(userId: number) {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  async deleteCart(userId: number) {
    return this.prisma.cart.delete({ where: { userId } });
  }

  // =========================
  // Cart Items
  // =========================

  // إضافة منتج للسلة
  async addItem(
    userId: number,
    productId: number,
    quantity = 1,
  ): Promise<CartItem> {
    // جلب السلة، أو إنشاء جديدة إذا لم توجد
    let cart = await this.prisma.cart.findUnique({ where: { userId } });

    if (!cart) {
      cart = await this.prisma.cart.create({ data: { userId } });
    }

    // التحقق إذا كان المنتج موجود في السلة
    const existingItem = await this.prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (existingItem) {
      // زيادة الكمية إذا كان موجودًا مسبقًا
      return this.prisma.cartItem.update({
        where: { cartId_productId: { cartId: cart.id, productId } },
        data: { quantity: existingItem.quantity + quantity },
      });
    }

    // إنشاء عنصر جديد إذا لم يكن موجودًا
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  // تعديل كمية عنصر في السلة
  async updateItemQuantity(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<CartItem> {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    return this.prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity },
    });
  }

  // حذف عنصر من السلة
  async removeItem(userId: number, productId: number) {
    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new Error('Cart not found');

    return this.prisma.cartItem.delete({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });
  }
}
