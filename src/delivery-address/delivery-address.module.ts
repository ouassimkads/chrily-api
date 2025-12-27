import { Module } from '@nestjs/common';
import { DeliveryAddressController } from './delivery-address.controller';
import { DeliveryAddressService } from './delivery-address.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [DeliveryAddressController],
  providers: [DeliveryAddressService, PrismaService],
})
export class DeliveryAddressModule {}
