// create-order.dto.ts
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt()
  productId: number;

  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsString()
  phoneNumber: string;

  @IsNumber()
  deliveryPrice: number;

  @IsString()
  paymentMethod: string;

  @IsNumber()
  storeId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
