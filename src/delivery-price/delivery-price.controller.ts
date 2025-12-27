import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StoreDeliveryPrice } from '@prisma/client';
import { DeliveryPriceService } from './delivery-price.service';
import { CreateNewDeliveryPrice } from './dto/create-new-delivery-price.dto';
import { GetDeliveryPriceDto } from './dto/get-delivery-price.dto';

@Controller('delivery-price')
export class DeliveryPriceController {
  constructor(private readonly deliveryPriceService: DeliveryPriceService) {}
  @Post()
  async createZoneDelivery(
    @Body() dto: CreateNewDeliveryPrice,
  ): Promise<StoreDeliveryPrice> {
    return this.deliveryPriceService.CreateNewZoneDelivery(dto);
  }
  @Get()
  getPrice(@Query() dto: GetDeliveryPriceDto) {
    return this.deliveryPriceService.getPrice(dto);
  }
}
