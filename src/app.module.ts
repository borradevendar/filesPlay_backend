import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User],
      autoLoadModels: true,
      synchronize: true, // auto create table
    }),
    SequelizeModule.forFeature([User]),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
