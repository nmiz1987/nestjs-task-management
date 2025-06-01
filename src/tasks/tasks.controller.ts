import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '@/auth/get-user.decorator';
import { User } from '@/auth/user.entity';
import { Logger } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" retrieving task with id: ${id}`);
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    this.logger.verbose(`User "${user.username}" deleting task with id: ${id}`);
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" updating task with id: ${id}. Data: ${JSON.stringify(updateTaskStatusDto)}`);
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Put()
  updateTask(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @GetUser() user: User): Promise<Task> {
    this.logger.verbose(`User "${user.username}" updating task with id: ${id}. Data: ${JSON.stringify(updateTaskDto)}`);
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }
}
