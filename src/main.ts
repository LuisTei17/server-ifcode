import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  console.log('######################');
  console.log(process.env.DB_USER);
  console.log('######################');
    const app = await NestFactory.create(AppModule);
 
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
