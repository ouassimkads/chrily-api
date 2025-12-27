import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeliveryAddressService {
  constructor(private prisma: PrismaService) {}
  //Todo Get delivery addresses
  async findAll() {
    return this.prisma.deliveryZone.findMany({
      orderBy: {
        id: 'asc',
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
