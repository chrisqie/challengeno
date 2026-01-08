import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  // 增加body-parser限制以支持大文件上传（base64编码）
  // 注意：必须在任何路由之前设置
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

  // 静态文件服务
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 确保上传目录存在
  const fs = require('fs');
  const uploadsDir = join(__dirname, '..', 'uploads');
  const avatarsDir = join(uploadsDir, 'avatars');
  const shopDir = join(uploadsDir, 'shop');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }
  if (!fs.existsSync(shopDir)) {
    fs.mkdirSync(shopDir, { recursive: true });
  }
  
  // 全局验证管道
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    exceptionFactory: (errors) => {
      const messages = errors.map(error =>
        Object.values(error.constraints || {}).join(', ')
      ).join('; ');
      return new Error(messages);
    },
  }));
  
  // CORS配置
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://142.171.117.89',
      'https://142.171.117.89',
      configService.get('CORS_ORIGIN')
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  // 全局前缀
  app.setGlobalPrefix('api');
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 BetTogether API is running on: http://localhost:${port}/api`);
}

bootstrap();
