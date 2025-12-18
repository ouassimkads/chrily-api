import { StoreCategory } from '@prisma/client';
import { IsOptional, IsString, IsBoolean, IsEnum } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(StoreCategory)
  category: StoreCategory;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
