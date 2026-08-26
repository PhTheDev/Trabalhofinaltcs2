import { Type } from "class-transformer";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateTrilhaDto {
    @IsString()
    @MinLength(1)
    titulo!: string;

    @IsString()
    @MinLength(1)
    descricao!: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCategoria!: number;
}
