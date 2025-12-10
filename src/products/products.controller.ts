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
  async findAll(@Query('storeId') storeId?: string): Promise<Product[]> {
    if (storeId) {
      return this.productsService.getProductsByStore(Number(storeId));
    }
    return this.productsService.findAll();
  }
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() data: any): Promise<Product> {
    return this.productsService.create(data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ): Promise<Product> {
    return this.productsService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productsService.remove(id);
  }
}
