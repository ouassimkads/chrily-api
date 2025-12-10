import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //! Get All Products
  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  //! Get Product by ID
  async findOne(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
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
  }): Promise<Product> {
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
  async getProductsByStore(storeId: number) {
    return this.prisma.product.findMany({
      where: { storeId },
    });
  }
}
