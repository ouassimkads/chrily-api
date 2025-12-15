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

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  //TODO:  CREATE NEW CATEGORY
  /**
   * The end point: POST categories with this JSON
   *  {
    "name": "nazim nazim",
    "imageUrl": "image/nazimnazim",
    "storeId": 8
    }
   *
   */
  @Post()
  async create(
    @Body() body: { name: string; imageUrl?: string; storeId: number },
  ) {
    return this.categoryService.createCategory(
      body.name,
      body.imageUrl,
      body.storeId,
    );
  }

  //TODO:  get One Category
  //? GET http://localhost:3000/categories/5
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.getCategoryById(id);
    return { data: category };
  }

  //TODO: update gategory
  //! you can for example update only the name or image
  /**
   * http://localhost:3000/categories/5
   * @param id
   * @param name
   * @param imageUrl
   * @returns
   */
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

  //TODO: Remove one category
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.deleteCategory(id);
    return { data: { id } };
  }
}
