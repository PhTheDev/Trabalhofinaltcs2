import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  nome!: string;

  @IsString()
  @MinLength(3)
  senha!: string;
}
