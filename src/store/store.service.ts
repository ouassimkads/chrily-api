import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
// import { Store } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  //TODO: Create Store
  create(data: CreateStoreDto) {
    return this.prisma.store.create({
      data,
    });
  }
  //TODO: Find all Stores
  async findAllStores(params?: { skip?: number; take?: number }) {
    return this.prisma.store.findMany({
      skip: params?.skip,
      take: params?.take,
    });
  }
  //TODO: Find one Store
  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) throw new NotFoundException('Store not found');

    return store;
  }
  //TODO: Find by ID with Categories and Products
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
  //TODO: Update Store
  async update(id: number, data: UpdateStoreDto) {
    await this.findOne(id); // للتحقق قبل التحديث

    return this.prisma.store.update({
      where: { id },
      data,
    });
  }
  //TODO:  Update status
  async updateStatus(id: number, isActive: boolean) {
    const store = await this.prisma.store.findUnique({
      where: { id },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return this.prisma.store.update({
      where: { id },
      data: { isActive },
    });
  }
  //TODO: Delete Store
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.store.delete({
      where: { id },
    });
  }
}
