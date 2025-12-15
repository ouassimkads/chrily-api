import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  providers: [StoreService, PrismaService, SupabaseService],
  controllers: [StoreController],
})
export class StoreModule {}
