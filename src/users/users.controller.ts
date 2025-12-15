import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /users
   * React Admin sends:
   * ?_page=1&_perPage=10&_sort=name&_order=ASC&name=John
   */
  @Get()
  async findAll(@Query('_page') page = 1, @Query('_limit') limit = 10) {
    const skip = (page - 1) * limit;
    const take = Number(limit);

    const [data, total] = await Promise.all([
      this.usersService.findAll({ skip, take }),
      this.usersService.count(),
    ]);

    return { data, total }; // ← هذا الشكل المطلوب
  }

  /**
   * GET /users/:id
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(Number(id));
  }

  /**
   * POST /users
   */
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /**
   * PUT /users/:id
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(Number(id), dto);
  }

  /**
   * DELETE /users/:id
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.usersService.delete(Number(id));
  }
}
