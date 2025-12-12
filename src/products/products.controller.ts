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
  async findAll(
    @Query('storeId') storeId?: string,
  ): Promise<{ data: Product[]; total: number }> {
    const products = storeId
      ? await this.productsService.getProductsByStore(Number(storeId))
      : await this.productsService.findAll();

    return {
      data: products,
      total: products.length,
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
  async create(@Body() body: any): Promise<{ data: Product }> {
    // <-- هنا
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = {
      ...body,
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      storeId: Number(body.storeId),
    };

    const product = await this.productsService.create(data);
    return { data: product }; // ✅ TypeScript يوافق الآن
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
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: { id: number } }> {
    await this.productsService.remove(id);
    return { data: { id } };
  }
}
