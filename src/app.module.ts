import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { StoreModule } from './store/store.module';
import { orderItemService } from './order-item/order-item.service';
import { OrderItemController } from './order-item/order-item.controller';
import { OrderItemModule } from './order-item/order-item.module';
import { UsersModule } from './users/users.module';
import { SupabaseService } from './supabase/supabase.service';
import { DeliveryPriceController } from './delivery-price/delivery-price.controller';
import { DeliveryPriceService } from './delivery-price/delivery-price.service';
import { DeliveryPriceModule } from './delivery-price/delivery-price.module';
import { DeliveryAddressModule } from './delivery-address/delivery-address.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoryModule,
    ProductsModule,
    CartModule,
    OrderModule,
    StoreModule,
    OrderItemModule,
    UsersModule,
    DeliveryPriceModule,
    DeliveryAddressModule,
  ],
  controllers: [
    AppController,
    AuthController,
    OrderItemController,
    DeliveryPriceController,
  ],
  providers: [
    AppService,
    orderItemService,
    SupabaseService,
    DeliveryPriceService,
  ],
})
export class AppModule {}
