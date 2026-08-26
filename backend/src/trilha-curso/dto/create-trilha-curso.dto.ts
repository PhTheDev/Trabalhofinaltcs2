import { Type } from "class-transformer";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateTrilhaCursoDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idTrilha!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCurso!: number;

    @IsString()
    @MinLength(1)
    ordem!: string;
}
