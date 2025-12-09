import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  // Cart
  @Post('create/:userId')
  createCart(@Param('userId') userId: string) {
    return this.cartService.createCart(Number(userId));
  }

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCartByUser(Number(userId));
  }

  @Delete(':userId')
  deleteCart(@Param('userId') userId: string) {
    return this.cartService.deleteCart(Number(userId));
  }

  // CartItems
  @Post('item/:userId/:productId')
  addItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity?: number,
  ) {
    return this.cartService.addItem(
      Number(userId),
      Number(productId),
      quantity,
    );
  }

  @Patch('item/:userId/:productId')
  updateItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItemQuantity(
      Number(userId),
      Number(productId),
      quantity,
    );
  }

  @Delete('item/:userId/:productId')
  removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeItem(Number(userId), Number(productId));
  }
}
