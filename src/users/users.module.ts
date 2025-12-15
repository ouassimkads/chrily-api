import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [PrismaModule], // ← هنا
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
