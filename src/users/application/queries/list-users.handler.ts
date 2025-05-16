import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListUsersQuery } from './list-users.query';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';
import { Inject } from '@nestjs/common';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
