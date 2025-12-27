import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  //TODO:  CREATE NEW CATEGORY
  @Post()
  async create(@Body() body: CreateCategoryDto) {
    return this.categoryService.createCategory(body);
  }

  //TODO:  READ ONE CATEGORY
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.getCategoryById(id);
    return { data: category };
  }

  //TODO: UPDATE ONE GATEGORY

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name?: string,
    @Body('imageUrl') imageUrl?: string,
  ) {
    const category = await this.categoryService.updateCategory(
      id,
      name,
      imageUrl,
    );
    return { data: category };
  }

  //TODO: REMOVE ONE CATEGORY
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.deleteCategory(id);
    return { data: { id } };
  }
}
