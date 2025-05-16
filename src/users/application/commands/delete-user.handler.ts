import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';
import { Inject } from '@nestjs/common';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    await this.userRepository.delete(command.id);
  }
}
