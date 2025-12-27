import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // إعداد Swagger
  const config = new DocumentBuilder()
    .setTitle('Kdili-api') // عنوان المشروع
    .setDescription('API description') // وصف المشروع
    .setVersion('1.0') // نسخة API
    // .addBearerAuth() // إذا كنت تستخدم JWT
    .build();

  app.enableCors({
    origin: '*', // اسمح لكل Origins (أو ضع فقط localhost:5173)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // يمكن الوصول إلى التوثيق على /api

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
