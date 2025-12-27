import { IsNumber } from 'class-validator';

export class CreateNewDeliveryPrice {
  @IsNumber()
  storeId: number;

  @IsNumber()
  zoneId: number;

  @IsNumber()
  price: number;
}
