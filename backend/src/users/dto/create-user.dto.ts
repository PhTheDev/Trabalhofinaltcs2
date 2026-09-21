import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/client';

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

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
