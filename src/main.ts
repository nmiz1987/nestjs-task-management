import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

const port = process.env.PORT ?? 3000;

async function mainApp() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port);
}
mainApp()
  .then(() => {
    console.log(`\n\n********* Server is running on port ${port} *********\n\n`);
  })
  .catch(error => {
    console.log('\n\n********* Server is not running *********\n\n');
    console.log(error);
  });
