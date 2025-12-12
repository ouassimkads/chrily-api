import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { Role } from 'common/enums/role.enum';
import { RolesGuard } from 'common/guards/roles.guard';
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Query('storeId') storeId?: string) {
    let products: Product[];

    if (storeId) {
      products = await this.productsService.getProductsByStore(Number(storeId));
    } else {
      products = await this.productsService.findAll();
    }

    return {
      data: products, // مهم جدًا
      total: products.length, // مهم للـ pagination
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  // @Roles(Role.ADMIN)
  async create(@Body() body: any): Promise<Product> {
    const product = await this.productsService.create(body);
    return { data: product };
  }

  @Patch(':id')
  // @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ): Promise<Product> {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  // @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.remove(id);
  }
}
