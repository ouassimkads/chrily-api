import { Module } from '@nestjs/common';
import { DeliveryPriceController } from './delivery-price.controller';
import { DeliveryPriceService } from './delivery-price.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DeliveryPriceController],
  providers: [DeliveryPriceService, PrismaService],
})
export class DeliveryPriceModule {}
