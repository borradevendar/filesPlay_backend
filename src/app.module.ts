import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.MYSQLHOST,
      port: +process.env.MYSQLPORT!,
      username: 'root',
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      models: [User],
      autoLoadModels: true,
      synchronize: true, // auto create table
    }),
    SequelizeModule.forFeature([User]),
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
