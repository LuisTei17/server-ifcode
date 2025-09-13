import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  console.log('######################');
  console.log(process.env.DB_USER);
  console.log('######################');
  const app = await NestFactory.create(AppModule);
  // Adiciona cookie-parser
  app.use(cookieParser());
  // Configura CORS para aceitar credenciais e cookies
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

  await app.listen(4000);
}
bootstrap();
