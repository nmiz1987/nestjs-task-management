import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  getAllTasks() {
    return {
      id: '1',
      title: 'Task 1',
      description: 'Task 1 description',
      status: 'pending',
    };
  }
}
