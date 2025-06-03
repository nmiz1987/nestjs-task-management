import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configEnum, configSchema } from 'config.schema';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MyLoggerModule } from './my-logger/my-logger.module';

@Module({
  imports: [
    /**
     * Load the config module (.env.stage.dev or .env.stage.prod)
     * The "forRoot" pattern in NestJS is a common architectural pattern that follows the Factory Method design pattern. Let me explain what it means and why it's used:
     * Root Configuration:
     * "Root" refers to the root/global configuration of a module
     * It's typically used when you want to configure a module at the application's entry point (usually in app.module.ts)
     * The configuration is done once and shared across the entire application
     * Static vs Dynamic Configuration:
     * forRoot(): Used for static configuration that's set once when the application starts
     * forRootAsync(): Used when you need dynamic configuration (like in your TypeORM setup) that depends on other services or async operations
     */
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validate: config => configSchema.parse(config),
    }),

    // Load the tasks module
    TasksModule,

    // Load the auth module
    AuthModule,

    // Load the typeorm module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: await configService.get(configEnum.DB_HOST),
        port: await configService.get(configEnum.DB_PORT),
        username: await configService.get(configEnum.DB_USERNAME),
        password: await configService.get(configEnum.DB_PASSWORD),
        database: await configService.get(configEnum.DB_DATABASE),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000, // 1 minute
        limit: 3,
      },
      {
        name: 'long',
        ttl: 60000 * 5, // 5 minutes
        limit: 100,
      },
    ]),
    MyLoggerModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
