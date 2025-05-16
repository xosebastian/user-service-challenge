import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  @Max(150)
  age: number;
}
