// src/users/application/commands/__tests__/create-user.handler.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserHandler } from '../create-user.handler';
import { CreateUserCommand } from '../create-user.command';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: USER_REPOSITORY_PROVIDER,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    userRepository = module.get<UserRepository>(USER_REPOSITORY_PROVIDER);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      const command = new CreateUserCommand('John Doe', 30);
      const user = new User();
      user.id = '1';
      user.name = 'John Doe';
      user.age = 30;

      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await handler.execute(command);

      expect(result).toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          age: 30,
        }),
      );
    });

    it('should throw an error if user cannot be created', async () => {
      const command = new CreateUserCommand('John Doe', 30);
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValue(new Error('Database Error'));

      await expect(handler.execute(command)).rejects.toThrow('Database Error');
    });
  });
});
