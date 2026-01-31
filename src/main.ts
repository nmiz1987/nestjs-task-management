import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

const port = process.env.PORT ?? 3000;

// Here's a visual representation of the execution flow:
// Request → Global Pipes → Route Handler → Global Interceptors → Response

const logger = new Logger();
async function mainApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api'); // for global route prefix - e.g., /api/users
  app.useGlobalPipes(new ValidationPipe()); // global pipes for validation
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
}
mainApp()
  .then(() => {
    logger.verbose(`***** Server is running on port ${port} *****`);
  })
  .catch(error => {
    logger.error(`\n\n**** Server is not running ****\n\n`);
    logger.error(error);
  });
