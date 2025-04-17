import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configSchema } from 'config.schema';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validate: config => {
        console.log(config);
        return configSchema.parse(config);
      },
    }),
    TasksModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: await configService.get('DB_HOST'),
        port: await configService.get('DB_PORT'),
        username: await configService.get('DB_USERNAME'),
        password: await configService.get('DB_PASSWORD'),
        database: await configService.get('DB_DATABASE'),
      }),
    }),
  ],
})
export class AppModule {}
