import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VisitsModule } from './visits/visits.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Visit } from './visits/visit.entity';
import * as mysql from 'mysql2';

 
@Module({
  imports: [
    TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'ifcode',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  // Adicione isso se estiver usando mysql2
  extra: {
    authPlugins: {
      mysql_native_password: () => require('mysql2').authPlugins.mysql_native_password
    }
  }
})

,
    AuthModule,
    UsersModule,
    VisitsModule,
  ],
})
export class AppModule {}
