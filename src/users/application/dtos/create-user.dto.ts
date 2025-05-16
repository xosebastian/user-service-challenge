import { IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Age of the user',
    example: 30,
    minimum: 0,
    maximum: 150,
  })
  @IsInt()
  @Min(0)
  @Max(150)
  age: number;
}
