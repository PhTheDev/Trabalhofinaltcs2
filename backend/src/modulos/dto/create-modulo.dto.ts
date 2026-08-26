import { Type } from "class-transformer";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateModuloDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCurso!: number;

    @IsString()
    @MinLength(1)
    titulo!: string;

    @IsString()
    @MinLength(1)
    ordem!: string;
}
