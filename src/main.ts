import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

const port = process.env.PORT ?? 3000;

const logger = new Logger();
async function mainApp() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
}
mainApp()
  .then(() => {
    logger.log(`\n\n********* Server is running on port ${port} *********\n\n`);
  })
  .catch(error => {
    logger.error(`\n\n********* Server is not running *********\n\n`);
    logger.error(error);
  });
