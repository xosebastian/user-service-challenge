import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserHandler } from '../update-user.handler';
import { UpdateUserCommand } from '../update-user.command';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';

describe('UpdateUserHandler', () => {
  let handler: UpdateUserHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserHandler,
        {
          provide: USER_REPOSITORY_PROVIDER,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<UpdateUserHandler>(UpdateUserHandler);
    userRepository = module.get<UserRepository>(USER_REPOSITORY_PROVIDER);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should update a user successfully', async () => {
      const command = new UpdateUserCommand('1', 'Updated Name', 35);
      const existingUser = new User();
      existingUser.id = '1';
      existingUser.name = 'John Doe';
      existingUser.age = 30;

      jest.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...existingUser,
        name: 'Updated Name',
        age: 35,
      });

      const result = await handler.execute(command);

      expect(result).toEqual({
        ...existingUser,
        name: 'Updated Name',
        age: 35,
      });
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated Name',
        age: 35,
      }));
    });

    it('should throw an error if user is not found', async () => {
      const command = new UpdateUserCommand('999', 'Non Existent User', 30);
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow('User not found');
      expect(userRepository.findById).toHaveBeenCalledWith('999');
    });

    it('should throw an error if save fails', async () => {
      const command = new UpdateUserCommand('1', 'Updated Name', 35);
      const existingUser = new User();
      existingUser.id = '1';
      existingUser.name = 'John Doe';
      existingUser.age = 30;

      jest.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Database Error'));

      await expect(handler.execute(command)).rejects.toThrow('Database Error');
    });
  });
});
