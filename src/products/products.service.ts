import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { SupabaseService } from 'src/supabase/supabase.service';
type ProductWithOptions = Prisma.ProductGetPayload<{
  include: { options: true };
}>;
@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}

  //! Get All Products
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  //! Get Product by ID
  async findOne(id: number): Promise<ProductWithOptions | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });
  }

  //! Create New Product
  async create(data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    categoryId: number;
    storeId: number; // ✅ مهم
  }): Promise<Product> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: data.categoryId,
        storeId: data.storeId,
      },
    });
    if (!category) {
      throw new BadRequestException('الفئة لا تنتمي لهذا المتجر');
    }
    return this.prisma.product.create({ data });
  }

  //! Update Product
  async update(id: number, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  //! Remove Product
  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  //! Get Products by Store
  async getProductsByStore(storeId: number) {
    return this.prisma.product.findMany({
      where: { storeId },
      include: {
        options: true, // جلب product options إن وُجدت
      },
    });
  }

  //? NOT USED ** بحث نصي عبر كل المنتجات **

  async searchProducts(q: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
    });
  }

  //? NOT USED  ** بحث نصي داخل منتجات متجر معين **
  async findByStoreAndSearch(storeId: number, q: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        storeId,
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
    });
  }
}
