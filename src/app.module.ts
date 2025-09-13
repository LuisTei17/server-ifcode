import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VisitsModule } from './visits/visits.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Visit } from './visits/visit.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Visit],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    VisitsModule,
  ],
})
export class AppModule {}
