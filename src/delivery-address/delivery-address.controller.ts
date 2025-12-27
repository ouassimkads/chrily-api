import { Controller, Get } from '@nestjs/common';
import { DeliveryAddressService } from './delivery-address.service';

@Controller('delivery-address')
export class DeliveryAddressController {
  constructor(
    private readonly deliveryAddressService: DeliveryAddressService,
  ) {}

  @Get()
  findAll() {
    return this.deliveryAddressService.findAll();
  }
}
