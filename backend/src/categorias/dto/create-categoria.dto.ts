import { IsString, MinLength } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    @MinLength(1)
    nome!: string;

    @IsString()
    @MinLength(1)
    descricao!: string;
}
