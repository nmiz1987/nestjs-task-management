import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.module';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task | undefined {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body('title') title: string, @Body('description') description: string): Task {
    if (!title) {
      throw new BadRequestException('Title is required');
    }
    if (!description) {
      throw new BadRequestException('Description is required');
    }
    return this.tasksService.createTask(title, description);
  }
}
