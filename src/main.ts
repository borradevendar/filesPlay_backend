import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: ['https://files-play-frontend-2yj8a6tlv-devendar-saiteja-borras-projects.vercel.app', 'https://filesplaybackend-production.up.railway.app'],
  credentials: true,
});
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
