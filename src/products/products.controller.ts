import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  // UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '@prisma/client';
// import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// import { Roles } from 'common/decorators/roles.decorator';
// import { Role } from 'common/enums/role.enum';
// import { RolesGuard } from 'common/guards/roles.guard';
import { SupabaseService } from 'src/supabase/supabase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private supabaseService: SupabaseService,
  ) {}

  @Get()
  async findAll(
    @Query('storeId') storeId?: string,
    @Query('q') q?: string, // <-- إضافة فلتر البحث
  ): Promise<{ data: Product[]; total: number }> {
    let products: Product[];

    if (storeId && q) {
      // البحث داخل منتجات المتجر المحدد
      products = await this.productsService.findByStoreAndSearch(
        Number(storeId),
        q,
      );
    } else if (storeId) {
      // كل منتجات المتجر فقط
      products = await this.productsService.getProductsByStore(Number(storeId));
    } else if (q) {
      // البحث عبر كل المنتجات
      products = await this.productsService.searchProducts(q);
    } else {
      // كل المنتجات بدون فلترة
      products = await this.productsService.findAll();
    }

    return {
      data: products,
      total: products.length,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: Product | null }> {
    const product = await this.productsService.findOne(id);
    return { data: product };
  }

  @Post()
  // @Roles(Role.ADMIN)
  async create(
    @Body()
    body: {
      name: string;
      description?: string;
      price: number;
      categoryId: number;
      storeId: number;
    },
  ): Promise<{ data: Product }> {
    const data = {
      name: body.name,
      description: body.description ?? '',
      price: Number(body.price),
      categoryId: Number(body.categoryId),
      storeId: Number(body.storeId),
    };

    const product = await this.productsService.create(data);

    return { data: product };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ): Promise<{ data: Product }> {
    const updatedProduct = await this.productsService.update(id, data);
    return { data: updatedProduct };
  }
  @Delete(':id')
  // @Roles(Role.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ data: { id: number } }> {
    await this.productsService.remove(id);
    return { data: { id } };
  }

  //----------------------------------------------------
  //TODO: --------- Upload Product Image ---------------
  // Used to upload product images to Supabase Storage
  // Used in product creation and update
  // Used by admins only
  //----------------------------------------------------
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('storeId') storeId: string,
    @Body('categoryId') categoryId: string,
    @Body('productId') productId: string,
  ) {
    //? Ensure the file exists to avoid undefined errors
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const fileName = `${productId}-${uuidv4()}.${file.originalname.split('.').pop()}`;
    const filePath = `store-${storeId}/category-${categoryId}/${fileName}`;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await this.supabaseService.client.storage
        .from('product-images')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        .upload(filePath, file.buffer, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const publicUrl = this.supabaseService.client.storage
        .from('product-images')
        .getPublicUrl(filePath).data.publicUrl;

      return { url: publicUrl, path: filePath };
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(err.message, parseInt(err.status) || 500);
    }
  }
}
