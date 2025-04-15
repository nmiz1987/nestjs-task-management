import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.findOne({ where: { id } });
    if (!foundTask) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return foundTask;
  }

  // async getTasksWithFilters(filterDto: GetTasksFilterDto): Promise<Task[]> {
  //   const { status, search } = filterDto;
  //   const tasks = await this.find();
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

  async deleteTask(id: string): Promise<void> {
    // const foundTask = await this.getTaskById(id);
    // if (!foundTask) {
    //   throw new NotFoundException(`Task with id ${id} not found`);
    // }
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.save(task);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }
}
