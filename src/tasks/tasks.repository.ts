import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '@/auth/user.entity';
import { Logger } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))', { search: `%${search}%` });
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const foundTask = await this.findOne({ where: { id, user } });
    if (!foundTask) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return foundTask;
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.delete({ id, user });
    if (!result) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    if (result.affected === 0) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    if (!task) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    task.status = status;
    await this.save(task);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);

    if (!task) {
      this.logger.error(`Task with id ${id} not found`);
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (updateTaskDto?.title) {
      task.title = updateTaskDto.title;
    }

    if (updateTaskDto?.description) {
      task.description = updateTaskDto.description;
    }

    await this.save(task);
    return task;
  }
}
