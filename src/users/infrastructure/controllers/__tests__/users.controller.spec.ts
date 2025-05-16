import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { UpdateUserDto } from '@users/application/dtos/update-user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UUIDParamDto } from '@users/application/dtos/uuid-param.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let commandBus: CommandBus;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [CommandBus, QueryBus],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    commandBus = module.get<CommandBus>(CommandBus);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = { name: 'John Doe', age: 30 };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce('User created');
      
      const result = await controller.createUser(createUserDto);
      expect(result).toEqual('User created');
    });

    it('should throw BadRequestException if name is missing', async () => {
      const createUserDto: any = { age: 30 };
      jest.spyOn(commandBus, 'execute').mockRejectedValueOnce(new BadRequestException('Invalid data'));
      
      await expect(controller.createUser(createUserDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('listUsers', () => {
    it('should list all users', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(['User 1', 'User 2']);
      
      const result = await controller.listUsers();
      expect(result).toEqual(['User 1', 'User 2']);
    });

    it('should return an empty list if no users found', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce([]);
      
      const result = await controller.listUsers();
      expect(result).toEqual([]);
    });
  });

  describe('getUser', () => {
    it('should get a user by ID', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce('User Details');
      
      const result = await controller.getUser({ id: '550e8400-e29b-41d4-a716-446655440000' } as UUIDParamDto);
      expect(result).toEqual('User Details');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(queryBus, 'execute').mockResolvedValueOnce(null);
      
      await expect(controller.getUser({ id: '550e8400-e29b-41d4-a716-446655440000' } as UUIDParamDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { name: 'Updated Name', age: 35 };
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce('User updated');
      
      const result = await controller.updateUser(
        { id: '550e8400-e29b-41d4-a716-446655440000' } as UUIDParamDto,
        updateUserDto,
      );
      expect(result).toEqual('User updated');
    });

    it('should throw BadRequestException if no data is provided', async () => {
      const updateUserDto: any = {};
      jest.spyOn(commandBus, 'execute').mockRejectedValueOnce(new BadRequestException('Invalid data'));
      
      await expect(
        controller.updateUser({ id: '550e8400-e29b-41d4-a716-446655440000' } as UUIDParamDto, updateUserDto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      jest.spyOn(commandBus, 'execute').mockResolvedValueOnce(undefined);
      
      const result = await controller.deleteUser({ id: '550e8400-e29b-41d4-a716-446655440000' } as UUIDParamDto);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(commandBus, 'execute').mockRejectedValueOnce(new NotFoundException('User not found'));
      
      await expect(controller.deleteUser({ id: '550e8400-e29b-41d4-a716-446655440000' } as UUIDParamDto))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
