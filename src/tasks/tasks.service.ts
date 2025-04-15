import { Injectable, NotFoundException } from '@nestjs/common';
// import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
// import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.tasksRepository.findOne({ where: { id } });
    console.log('=========================');
    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return foundTask;
  }
  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   const tasks = this.getAllTasks();
  //   const tmp: Task[] = [];
  //   tasks.forEach(task => {
  //     if (status && task.status === status) {
  //       tmp.push(task);
  //     } else if (
  //       (search && task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ||
  //       (search && task.description.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  //     ) {
  //       tmp.push(task);
  //     }
  //   });
  //   return tmp;
  // }
  // deleteTask(id: string): void {
  //   const foundTask = this.getTaskById(id);
  //   if (!foundTask) {
  //     throw new NotFoundException(`Task with id ${id} not found`);
  //   }
  //   this.tasks = this.tasks.filter(task => task.id !== foundTask.id);
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   if (!task) {
  //     throw new NotFoundException(`Task with id ${id} not found`);
  //   }
  //   task.status = status;
  //   return task;
  // }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const newTask: Task = {
      title,
      description,
      id: '123123123',
      status: TaskStatus.OPEN,
    };
    await this.tasksRepository.insert(newTask);
    return newTask;
  }
}
