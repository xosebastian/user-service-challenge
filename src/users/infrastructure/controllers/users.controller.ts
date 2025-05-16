import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { CreateUserCommand } from '@users/application/commands/create-user.command';
import { UpdateUserCommand } from '@users/application/commands/update-user.command';
import { DeleteUserCommand } from '@users/application/commands/delete-user.command';
import { GetUserQuery } from '@users/application/queries/get-user.query';
import { ListUsersQuery } from '@users/application/queries/list-users.query';
import { CreateUserDto } from '@users/application/dtos/create-user.dto';
import { UpdateUserDto } from '@users/application/dtos/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User successfully created.' })
  @ApiBadRequestResponse({ description: 'Invalid user data.' })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const command = new CreateUserCommand(
      createUserDto.name,
      createUserDto.age,
    );
    return this.commandBus.execute(command);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  async listUsers() {
    const query = new ListUsersQuery();
    return this.queryBus.execute(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    return this.queryBus.execute(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiBadRequestResponse({ description: 'Invalid user data.' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const command = new UpdateUserCommand(
      id,
      updateUserDto.name,
      updateUserDto.age,
    );
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    const command = new DeleteUserCommand(id);
    return this.commandBus.execute(command);
  }
}
