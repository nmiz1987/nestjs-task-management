import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.module';
import { v7 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task | undefined {
    const foundTask = this.tasks.find(task => task.id === id);
    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return foundTask;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    const tasks = this.getAllTasks();
    const tmp: Task[] = [];

    tasks.forEach(task => {
      if (status && task.status === status) {
        tmp.push(task);
      } else if (
        (search && task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ||
        (search && task.description.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      ) {
        tmp.push(task);
      }
    });

    return tmp;
  }

  deleteTask(id: string): void {
    const foundTask = this.getTaskById(id);
    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    this.tasks = this.tasks.filter(task => task.id !== foundTask.id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    task.status = status;
    return task;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const newTask: Task = {
      title,
      description,
      id: uuid(),
      status: TaskStatus.OPEN,
    };
    this.tasks.push(newTask);
    return newTask;
  }
}
