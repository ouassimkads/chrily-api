import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  // Create
  create(data: CreateStoreDto) {
    return this.prisma.store.create({
      data,
    });
  }
  //TODO:  Update status
  async updateStatus(id: number, isActive: boolean) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('المتجر غير موجود');
    }

    return this.prisma.store.update({
      where: { id },
      data: { isActive },
    });
  }
  // Find all
  // NestJS service مثال
  async findAllStores(params?: { skip?: number; take?: number }) {
    return this.prisma.store.findMany({
      skip: params?.skip,
      take: params?.take,
    });
  }
  async findByIdWithCategoriesAndProducts(id: number) {
    return this.prisma.store.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            products: true,
          },
        },
      },
    });
  }

  async countAllStores(): Promise<number> {
    return this.prisma.store.count();
  }
  // ✅ الدالة الجديدة: البحث حسب IDs
  async findManyByIds(ids: number[]): Promise<Store[]> {
    return this.prisma.store.findMany({
      where: { id: { in: ids } },
    });
  }
  // Find one
  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) throw new NotFoundException('Store not found');

    return store;
  }

  // Update
  async update(id: number, data: UpdateStoreDto) {
    await this.findOne(id); // للتحقق قبل التحديث

    return this.prisma.store.update({
      where: { id },
      data,
    });
  }

  // Delete
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.store.delete({
      where: { id },
    });
  }
}
