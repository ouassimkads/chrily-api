import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { skip: number; take: number }) {
    return this.prisma.user.findMany({
      skip: params.skip,
      take: params.take,
      orderBy: { id: 'asc' },
    });
  }

  async count() {
    return this.prisma.user.count();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(dto: any) {
    return this.prisma.user.create({ data: dto });
  }

  async update(id: number, dto: any) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
