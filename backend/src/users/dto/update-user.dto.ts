import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '../../generated/prisma/client';

/** Equivalente a um Serializer parcial (PATCH) do Django. */
export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  nome?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  senha?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
