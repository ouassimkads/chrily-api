import {
  BadRequestException,
  Body,
  Controller,
  // Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { orderItemService } from './order-item.service';

@Controller('order_items')
export class OrderItemController {
  orderService: any;
  constructor(private orderItemService: orderItemService) {}

  @Get()
  async find(@Query('orderId') orderId: string) {
    if (!orderId) {
      return { data: [], total: 0 };
    }

    const items = await this.orderItemService.findByOrderId(Number(orderId));

    return {
      data: items,
      total: items.length,
    };
  }

  // @Delete(':id')
  // remove(@Param('id') id: number) {
  //   return this.orderItemService.remove(id);
  // }

  // POST /order_items/add?orderId=5
  // مسار لإضافة عنصر للطلب
  @Post(':id/add-item')
  addNewItemToOrderById(
    @Param('id') orderId: string,
    @Body()
    body: {
      productId: number;
      quantity: number;
      price: number;
      productOptionId?: number;
    },
  ) {
    return this.orderItemService.addNewItemToOrderById({
      orderId: Number(orderId),
      productId: body.productId,
      quantity: body.quantity,
      price: body.price,
      productOptionId: body.productOptionId || null,
    });
  }

  //TODO: update price or quantity of one order_item
  // تحديث كمية أو سعر عنصر واحد داخل الطلب
  @Patch(':itemId')
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() body: { quantity?: number; price?: number },
  ) {
    // التحقق من القيم المدخلة
    if (body.quantity !== undefined && body.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }
    if (body.price !== undefined && body.price < 0) {
      throw new BadRequestException('Price must be non-negative');
    }

    // استدعاء الخدمة المخصصة لإدارة عناصر الطلب
    const updatedItem = await this.orderItemService.updateItem(
      Number(itemId),
      body,
    );

    return {
      message: `Order item with id ${itemId} updated successfully`,
      data: updatedItem,
    };
  }
}
