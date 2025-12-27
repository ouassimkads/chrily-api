import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDeliveryPriceDto {
  @Type(() => Number)
  @IsNumber()
  storeId: number;

  @Type(() => Number)
  @IsNumber()
  zoneId: number;
}
