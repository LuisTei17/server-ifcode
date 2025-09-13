import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { existsSync, mkdirSync } from 'fs';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  });
 
  const config = new DocumentBuilder()
    .setTitle('Volunteer Elderly API')
    .setDescription('API para voluntariado de idosos')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve arquivos estáticos da pasta uploads em /uploads
  const uploadsDir = 'uploads';
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir);
  }
  app.use('/uploads', express.static(uploadsDir));

  await app.listen(4000);
}
bootstrap();
