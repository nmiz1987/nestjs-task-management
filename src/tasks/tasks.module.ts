import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    /**
     * forFeature in NestJS is a method used with TypeORM (and other ORMs) to register a specific entity or set of entities for use within a module. Let me explain its purpose and usage:
     * Purpose:
     * Registers specific entities for use in a module
     * Creates a repository for the specified entity
     * Makes the entity's repository available for dependency injection in that module
     */
    TypeOrmModule.forFeature([Task]),
    AuthModule,
  ],
  controllers: [TasksController],
  providers: [TasksService, TasksRepository],
})
export class TasksModule {}
