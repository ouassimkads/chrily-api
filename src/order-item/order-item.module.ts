import { Module } from '@nestjs/common';
import { orderItemService } from './order-item.service';
import { OrderItemController } from './order-item.controller';
import { PrismaService } from '../prisma/prisma.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [OrderModule],
  controllers: [OrderItemController],
  providers: [orderItemService, PrismaService],
})
export class OrderItemModule {}
