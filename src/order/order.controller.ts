/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  // UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  // @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Req() req, @Body() body: any) {
    // body.items = [{ productId, quantity, price }]
    return this.orderService.createOrder(
      body.userId,
      body.items,
      body.deliveryPrice,
      body.paymentMethod,
    );
  }

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@Req() req) {
    return this.orderService.getOrdersByUser(req.user.userId);
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.orderService.getOrderById(Number(id));
  }
}
