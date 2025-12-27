import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  //TODO: Create New Category
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const { name, imageUrl, storeId } = dto;
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

  //TODO: Get Single Category
  async getCategoryById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  //TODO: Update Category
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

  //TODO: Remove Category
  async deleteCategory(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
