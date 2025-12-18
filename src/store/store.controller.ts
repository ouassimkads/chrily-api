import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from '@prisma/client';
import { UpdateStoreStatusDto } from './dto/update-store-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from 'src/supabase/supabase.service';
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private supabaseService: SupabaseService,
  ) {}

  @Post()
  async create(@Body() dto: CreateStoreDto) {
    const store = await this.storeService.create(dto);
    return { data: store };
  }

  @Get()
  // async findAll(
  //   @Query('ids') ids?: string,
  //   @Query('skip') skip = '0',
  //   @Query('take') take = '10',
  // ): Promise<{ data: Store[]; total: number }> {
  //   let stores;

  //   // تحويل القيم من string إلى number
  //   const skipNumber = parseInt(skip as string, 10) || 0;
  //   const takeNumber = parseInt(take as string, 10) || 10;

  //   if (ids) {
  //     const idArray = ids.split(',').map(Number);
  //     stores = await this.storeService.findManyByIds(idArray);
  //   } else {
  //     stores = await this.storeService.findAllStores({
  //       skip: skipNumber,
  //       take: takeNumber,
  //     });
  //   }

  //   const total = await this.storeService.countAllStores();
  //   return { data: stores, total };
  // }
  async findAll(): Promise<{ data: Store[]; total: number }> {
    // جلب جميع المتاجر
    const stores = await this.storeService.findAllStores();

    // حساب العدد الكلي
    const total = await this.storeService.countAllStores();

    return { data: stores, total };
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const store = await this.storeService.findByIdWithCategoriesAndProducts(
      Number(id),
    );
    return {
      data: store,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStoreDto) {
    const store = await this.storeService.update(+id, dto);
    return { data: store };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const store = await this.storeService.remove(+id);
    return { data: { id: +id } };
  }
  //TODO:  Update status
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStoreStatusDto,
  ) {
    return this.storeService.updateStatus(id, dto.isActive);
  }

  //----------------------------------------------------
  //TODO: --------- Upload ٍStore Image ---------------
  // Used to upload Store images to Supabase Storage
  // Used in Store creation and update
  // Used by admins only
  //----------------------------------------------------
  @Post('upload-store-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStoreImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('storeId') storeId: string,
  ) {
    // التأكد من وجود الملف
    if (!file) {
      throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
    }

    if (!storeId) {
      throw new HttpException('storeId is required', HttpStatus.BAD_REQUEST);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const extension = file.originalname.split('.').pop();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const fileName = `store-${storeId}-${uuidv4()}.${extension}`;
    const filePath = `store-${storeId}/store-image/${fileName}`;

    try {
      const { error } = await this.supabaseService.client.storage
        .from('store-images') // Bucket خاص بالمتاجر
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        .upload(filePath, file.buffer, {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          contentType: file.mimetype,
          upsert: true,
        });

      if (error) throw error;

      const publicUrl = this.supabaseService.client.storage
        .from('store-images')
        .getPublicUrl(filePath).data.publicUrl;

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      throw new HttpException(err.message, err.status || 500);
    }
  }
}
