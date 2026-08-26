import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

/** Equivalente a um Serializer parcial (PATCH) do Django. */
export class UpdateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  nome?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  senha?: string;
}
