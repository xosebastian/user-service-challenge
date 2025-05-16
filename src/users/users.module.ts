import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from '@users/infrastructure/controllers/users.controller';
import { User } from '@users/domain/entities/user.entity';

import { CreateUserHandler } from '@users/application/commands/create-user.handler';
import { UpdateUserHandler } from '@users/application/commands/update-user.handler';
import { DeleteUserHandler } from '@users/application/commands/delete-user.handler';
import { GetUserHandler } from '@users/application/queries/get-user.handler';
import { ListUsersHandler } from '@users/application/queries/list-users.handler';
import { UserRepositoryImpl } from './infrastructure/persistence/user.repository.impl';
import { USER_REPOSITORY_PROVIDER } from './users.providers';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  providers: [
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    GetUserHandler,
    ListUsersHandler,
    {
      provide: USER_REPOSITORY_PROVIDER,
      useClass: UserRepositoryImpl,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
