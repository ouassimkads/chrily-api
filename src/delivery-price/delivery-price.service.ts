/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewDeliveryPrice } from './dto/create-new-delivery-price.dto';
import { StoreDeliveryPrice } from '@prisma/client';
import { GetDeliveryPriceDto } from './dto/get-delivery-price.dto';

@Injectable()
export class DeliveryPriceService {
  constructor(private prisma: PrismaService) {}

  //TODO: add Delivery Zone
  async CreateNewZoneDelivery(
    dto: CreateNewDeliveryPrice,
  ): Promise<StoreDeliveryPrice> {
    try {
      const { storeId, zoneId, price } = dto;
      return await this.prisma.storeDeliveryPrice.create({
        data: { storeId, zoneId, price },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);

      throw new BadRequestException(message);
    }
  }
  async getPrice(dto: GetDeliveryPriceDto) {
    const { storeId, zoneId } = dto;

    const delivery = await this.prisma.storeDeliveryPrice.findFirst({
      where: {
        storeId,
        zoneId,
      },
      select: {
        price: true,
        storeId: true,
        zoneId: true,
      },
    });

    if (!delivery) {
      throw new NotFoundException(
        `Price not found for storeId=${storeId} & zoneId=${zoneId}`,
      );
    }

    return delivery;
  }
}
