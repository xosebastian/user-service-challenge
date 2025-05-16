import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from '@users/domain/repositories/user.repository';
import { User } from '@users/domain/entities/user.entity';
import { USER_REPOSITORY_PROVIDER } from '@users/users.providers';
import { Inject } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @Inject(USER_REPOSITORY_PROVIDER)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUserQuery): Promise<User> {
    return this.userRepository.findById(query.id);
  }
}
