import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  //TODO: Create New Category
  /**
   * For Create New
   * @param name
   * @param imageUrl
   * @param storeId
   * @returns
   */
  async createCategory(
    name: string,
    imageUrl: string | undefined,
    storeId: number, // ← إضافة معرف المتجر
  ): Promise<Category> {
    return this.prisma.category.create({
      data: {
        name,
        imageUrl,
        store: {
          connect: { id: storeId },
        },
      },
    });
  }

  //! Get All Gategory
  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  //! Get Single Category
  async getCategoryById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  //! Update Category
  async updateCategory(
    id: number,
    name?: string,
    imageUrl?: string,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: { name, imageUrl },
    });
  }

  //! Remove Category
  async deleteCategory(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
