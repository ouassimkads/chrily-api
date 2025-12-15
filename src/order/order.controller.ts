/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Delete,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}
  //TODO: CREATE NEW ORDER WITH THIS JSON BOLOW
  //? with is url: http://localhost:3000/orders add the blow body request
  /**
   * 
      {
        "userId": 1,
        "phoneNumber": "0555123456",
        "deliveryPrice": 500,
        "paymentMethod": "cash_on_delivery",
        "items": [
          { "productId": 29, "quantity": 2 },
          { "productId": 30, "quantity": 1 }
        ]
      }
   */
  @Post()
  async createOrder(@Body() body: CreateOrderDto) {
    return {
      data: await this.orderService.createOrder(
        body.phoneNumber,
        body.items,
        body.deliveryPrice,
        body.paymentMethod,
        undefined,
      ),
    };
  }

  //TODO: GET all the (orders and  items)  for specific user
  //? use that: GET http://localhost:3000/orders/user/1
  @Get('user/:userId')
  async getOrderByUser(@Param('userId') userId: string) {
    const orders = await this.orderService.findByUserId(Number(userId));
    return { data: orders };
  }

  //TODO: update order status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(Number(id), body.status);
  }

  //TODO: Get all the orders with pagination
  //? use that: http://localhost:3000/orders?_page=2&_limit=5
  @Get()
  async getOrders(@Query() query: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { _page = 1, _limit = 10 } = query;

    const orders = await this.orderService.findAll({
      skip: (Number(_page) - 1) * Number(_limit),
      take: Number(_limit),
    });

    const total = await this.orderService.countAll();

    return {
      data: orders,
      total,
    };
  }

  //TODO: get specefic order with all the items with this order
  //? use that with http://localhost:3000/orders/9
  @Get(':id')
  async getOrder(@Param('id') id: string) {
    const order = await this.orderService.findByIdWithItems(Number(id));

    return {
      data: order, //! that for return all the items with this order
    };
  }

  //TODO update order by id
  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() body: any) {
    // تحقق من حالة الطلب إذا تم تمريرها
    const allowedStatuses = ['pending', 'delivering', 'completed', 'canceled'];
    if (body.status && !allowedStatuses.includes(body.status)) {
      throw new BadRequestException('Invalid status');
    }
    const updateOrder = await this.orderService.update(Number(id), body);
    return {
      message: `order with id ${id} update successfully`,
      data: updateOrder,
    };
  }

  //TODO: Delete order with all the item related with it because i add orderItems OrderItem[] @relation(onDelete: Cascade) on prisma.shcema
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    const deleteOrder = await this.orderService.remove(Number(id));
    return {
      message: `order with id ${id} deleted successfully`,
      data: deleteOrder,
    };
  }
}
