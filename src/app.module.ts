import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { VisitsModule } from './visits/visits.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
          extra: {
    authPlugins: {
      mysql_native_password: () => require('mysql2').authPlugins.mysql_native_password
    }
  }
      }),
    }),
    AuthModule,
    UsersModule,
    VisitsModule,
  ],
})
export class AppModule {}