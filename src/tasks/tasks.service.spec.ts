import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { Test } from '@nestjs/testing';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '@/auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  getTaskById: jest.fn(),
  deleteTask: jest.fn(),
  updateTaskStatus: jest.fn(),
  createTask: jest.fn(),
});

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: jest.Mocked<TasksRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [TasksService, { provide: TasksRepository, useFactory: mockTasksRepository }],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      const result = [];
      const mockUser = new User();
      const filterDto: Partial<GetTasksFilterDto> = {};
      tasksRepository.getTasks.mockResolvedValue(result);

      expect(tasksRepository.getTasks.mock.calls.length).toBe(0);

      const tasks = await tasksService.getTasks(filterDto as GetTasksFilterDto, mockUser);
      expect(tasksRepository.getTasks.mock.calls.length).toBeGreaterThan(0);
      expect(tasksRepository.getTasks.mock.calls[0]).toEqual([filterDto, mockUser]);
      expect(tasks).toBe(result);
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.getTaskById and returns the result', async () => {
      const mockTask: Task = { user: new User(), id: '1', title: 'Test', description: 'Test', status: TaskStatus.OPEN };
      const mockUser = new User();
      tasksRepository.getTaskById.mockResolvedValue(mockTask);

      expect(tasksRepository.getTasks.mock.calls.length).toBe(0);

      const result = await tasksService.getTaskById(mockTask.id, mockUser);

      expect(tasksRepository.getTaskById.mock.calls.length).toBeGreaterThan(0);
      expect(tasksRepository.getTaskById.mock.calls[0]).toEqual([mockTask.id, mockUser]);
      expect(result).toBe(mockTask);
    });

    it('calls TasksRepository.getTaskById and handles an error', async () => {
      const mockUser = new User();
      const mockId = '1';
      const expectedError = new NotFoundException(`Task with id ${mockId} not found`);

      tasksRepository.getTaskById.mockRejectedValue(expectedError);

      await expect(tasksService.getTaskById(mockId, mockUser)).rejects.toThrow(expectedError);
      expect(tasksRepository.getTaskById.mock.calls[0]).toEqual([`${mockId}`, mockUser]);
    });
  });
});
