import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 유효성 검사 및 세션 설정, AppModule에서 설정함
  // 세션, 쿠키 사용
  // app.use(
  //   cookieSession({
  //     keys: ['siwoo'],
  //   }),
  // );
  // 유효성 검사
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );

  const options = new DocumentBuilder()
    .setTitle('MyCV API')
    .setDescription('MyCV API Description')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, doc);  
  await app.listen(3000);
}
bootstrap();
