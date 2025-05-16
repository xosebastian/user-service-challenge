import { Test, TestingModule } from '@nestjs/testing';
import { ListUsersHandler } from '../list-users.handler';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';

describe('ListUsersHandler', () => {
  let handler: ListUsersHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListUsersHandler,
        {
          provide: USER_REPOSITORY_PROVIDER,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<ListUsersHandler>(ListUsersHandler);
    userRepository = module.get(USER_REPOSITORY_PROVIDER);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return a list of users if found', async () => {
      const users: User[] = [
        { id: '1', name: 'John Doe', age: 30 } as User,
        { id: '2', name: 'Jane Doe', age: 25 } as User,
      ];

      userRepository.findAll.mockResolvedValueOnce(users);

      const result = await handler.execute();
      expect(result).toEqual(users);
      expect(userRepository.findAll).toHaveBeenCalled();
    });

    it('should return an empty list if no users are found', async () => {
      userRepository.findAll.mockResolvedValueOnce([]);

      const result = await handler.execute();
      expect(result).toEqual([]);
      expect(userRepository.findAll).toHaveBeenCalled();
    });
  });
});
