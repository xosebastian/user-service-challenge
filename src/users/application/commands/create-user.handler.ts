import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';
import { Inject } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { name, age } = command;
    const user = new User();
    user.name = name;
    user.age = age;
    return this.userRepository.save(user);
  }
}
