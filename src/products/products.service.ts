import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
type ProductWithOptions = Prisma.ProductGetPayload<{
  include: { options: true };
}>;
@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
  ) {}
  //TODO: Create New Product Service
  async create(data: {
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable?: boolean;
    categoryId: number;
    storeId: number;
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

  //TODO: all the GET products service with filters

  // ***********************************//
  //? findAll GET all products
  //? getProductsByStore GET products by store
  //? findOne GET product by ID
  //? findByStoreAndSearch GET products by store and search query
  //? searchProducts GET products by search query
  // ***********************************//

  //? Get All Products
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  //? Get Products by Store
  async getProductsByStore(storeId: number) {
    return this.prisma.product.findMany({
      where: { storeId },
      include: {
        options: true,
        category: true,
      },
    });
  }

  //? Get Product by ID
  async findOne(id: number): Promise<ProductWithOptions | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        options: true,
      },
    });
  }
  //? search products by store and query
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
  //? search products by query
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
  // add new productOption
  async addProductOption(dto: CreateProductOptionDto) {
    try {
      const option = await this.prisma.productOption.create({
        data: {
          productId: dto.productId,
          name: dto.name,
          price: dto.price ?? 0,
        },
      });

      return option;
    } catch (error) {
      console.error('Error adding product option:', error);
      throw new Error('فشل إضافة خيار المنتج');
    }
  }
  async getProductOptions(productId: number) {
    return this.prisma.productOption.findMany({
      where: { productId },
    });
  }
  // حذف خيار معين
  async removeProductOption(optionId: number) {
    return this.prisma.productOption.delete({
      where: { id: optionId },
    });
  }
  //TODO: Update Product
  async update(id: number, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  //TODO: Remove Product
  async remove(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
