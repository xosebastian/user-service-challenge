// src/users/infrastructure/persistence/__tests__/user.repository.impl.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryImpl } from '../user.repository.impl';
import { User } from '@users/domain/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UserRepositoryImpl', () => {
  let repository: UserRepositoryImpl;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a user successfully', async () => {
      const user = new User();
      user.name = 'John Doe';
      user.age = 30;

      jest.spyOn(userRepository, 'save').mockResolvedValue(user);
      const result = await repository.save(user);
      expect(result).toEqual(user);
    });

    it('should update an existing user', async () => {
      const user = new User();
      user.id = '1';
      user.name = 'John Doe';
      user.age = 30;

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'save').mockResolvedValue({ ...user, name: 'Updated Name' });

      const result = await repository.save({ ...user, name: 'Updated Name' });
      expect(result.name).toEqual('Updated Name');
    });

    it('should throw NotFoundException if updating a non-existing user', async () => {
      const user = new User();
      user.id = '999';
      user.name = 'Non Existent User';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(repository.save(user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      const user = new User();
      user.id = '1';
      user.name = 'John Doe';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(userRepository, 'delete').mockResolvedValue({ affected: 1 } as any);

      await expect(repository.delete('1')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      await expect(repository.delete('999')).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if delete fails', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(new User());
      jest.spyOn(userRepository, 'delete').mockRejectedValue(new Error('Database Error'));

      await expect(repository.delete('1')).rejects.toThrow('Database Error');
    });
  });
});
