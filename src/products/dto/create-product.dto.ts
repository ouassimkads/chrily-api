import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Product Name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Product Description' })
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Product Price' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Category ID' })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ description: 'Store ID' })
  @IsNumber()
  storeId: number;

  @ApiPropertyOptional({ description: 'Product Image URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Is Product Available?' })
  isAvailable?: boolean;
}
