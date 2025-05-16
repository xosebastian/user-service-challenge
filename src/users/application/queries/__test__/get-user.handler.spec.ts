import { Test, TestingModule } from '@nestjs/testing';
import { GetUserHandler } from '../get-user.handler';
import { GetUserQuery } from '../get-user.query';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';

describe('GetUserHandler', () => {
  let handler: GetUserHandler;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserHandler,
        {
          provide: USER_REPOSITORY_PROVIDER,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetUserHandler>(GetUserHandler);
    userRepository = module.get(USER_REPOSITORY_PROVIDER);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should return a user if found', async () => {
      const user = new User();
      user.id = '1';
      user.name = 'John Doe';
      user.age = 30;

      userRepository.findById.mockResolvedValueOnce(user);

      const query = new GetUserQuery('1');
      const result = await handler.execute(query);

      expect(result).toEqual(user);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should return null if user is not found', async () => {
      userRepository.findById.mockResolvedValueOnce(null);

      const query = new GetUserQuery('999');
      const result = await handler.execute(query);

      expect(result).toBeNull();
      expect(userRepository.findById).toHaveBeenCalledWith('999');
    });
  });
});
