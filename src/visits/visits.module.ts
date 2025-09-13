import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visit } from './visit.entity';
import { VisitsController } from './visits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Visit])],
  controllers: [VisitsController],
})
export class VisitsModule {}
