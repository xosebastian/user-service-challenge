import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Name of the user (optional)',
    example: 'John Doe',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Age of the user (optional)',
    example: 30,
    minimum: 0,
    maximum: 150,
  })
  age?: number;
}
