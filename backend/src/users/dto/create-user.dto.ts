import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/** Equivalente a um Serializer/Form do Django para criação. */
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  nome?: string;

  @IsString()
  @MinLength(3)
  senha!: string;
}
