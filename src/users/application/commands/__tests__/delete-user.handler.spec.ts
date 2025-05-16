import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserHandler } from '../delete-user.handler';
import { DeleteUserCommand } from '../delete-user.command';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: USER_REPOSITORY_PROVIDER,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteUserHandler>(DeleteUserHandler);
    userRepository = module.get<UserRepository>(USER_REPOSITORY_PROVIDER);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('execute', () => {
    it('should delete a user successfully', async () => {
      const command = new DeleteUserCommand('1');
      jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

      await expect(handler.execute(command)).resolves.toBeUndefined();
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if user cannot be deleted', async () => {
      const command = new DeleteUserCommand('999');
      jest
        .spyOn(userRepository, 'delete')
        .mockRejectedValue(new Error('Database Error'));

      await expect(handler.execute(command)).rejects.toThrow('Database Error');
    });
  });
});
