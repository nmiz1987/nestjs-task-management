import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from '@/auth/user.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { MyLoggerService } from '@/my-logger/my-logger.service';

@Injectable()
export class TasksService {
  private logger = new MyLoggerService(TasksService.name);

  constructor(private tasksRepository: TasksRepository) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    this.logger.verbose(`Retrieving all tasks for user ${user.username}, Filters: ${JSON.stringify(filterDto)}`);
    return this.tasksRepository.getTasks(filterDto, user);
  }

  getTaskById(id: string, user: User): Promise<Task> {
    this.logger.verbose(`Retrieving task with ID ${id} for user ${user.username}`);
    return this.tasksRepository.getTaskById(id, user);
  }

  deleteTask(id: string, user: User): Promise<void> {
    this.logger.verbose(`Deleting task with ID ${id} for user ${user.username}`);
    return this.tasksRepository.deleteTask(id, user);
  }

  updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    this.logger.verbose(`Updating task with ID ${id} to status ${status} for user ${user.username}`);
    return this.tasksRepository.updateTaskStatus(id, status, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    this.logger.verbose(`Creating a new task for user ${user.username}. Data: ${JSON.stringify(createTaskDto)}`);

    return this.tasksRepository.createTask(createTaskDto, user);
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    this.logger.verbose(`Updating task with ID ${id} for user ${user.username}. Data: ${JSON.stringify(updateTaskDto)}`);
    return this.tasksRepository.updateTask(id, updateTaskDto, user);
  }
}
