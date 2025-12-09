import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  // Create
  create(data: CreateStoreDto) {
    return this.prisma.store.create({
      data,
    });
  }

  // Find all
  findAll() {
    return this.prisma.store.findMany();
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
