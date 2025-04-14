import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap()
  .then(() => {
    console.log(`\n\n********* Server is running on port ${port} *********\n\n`);
  })
  .catch(error => {
    console.log('\n\n********* Server is not running *********\n\n');
    console.log(error);
  });
