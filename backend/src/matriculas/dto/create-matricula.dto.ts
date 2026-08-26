import { Type } from "class-transformer";
import { IsDate, IsInt, IsOptional, Min } from "class-validator";

export class CreateMatriculaDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idUsuario!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCurso!: number;

    @Type(() => Date)
    @IsDate()
    dataMatricula!: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dataConclusao?: Date;
}