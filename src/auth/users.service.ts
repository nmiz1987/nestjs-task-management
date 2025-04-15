import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class TasksService {
  constructor(private usersRepository: UsersRepository) {}
}
