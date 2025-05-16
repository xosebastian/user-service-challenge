import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';
import { Inject } from '@nestjs/common';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, name, age } = command;
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');

    user.name = name;
    user.age = age;
    return this.userRepository.save(user);
  }
}
