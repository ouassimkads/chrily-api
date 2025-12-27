// create-order.dto.ts
import {
  IsArray,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsInt()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsInt()
  productOptionId?: number; // ← نفس الاسم كما في request JSON
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

  @IsNumber()
  zoneId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
