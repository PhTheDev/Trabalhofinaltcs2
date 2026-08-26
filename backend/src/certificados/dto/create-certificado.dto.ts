import { Type } from "class-transformer";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateCertificadoDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idUsuario!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCurso!: number

    @IsString()
    @MinLength(1)
    codigoVerificacao!: string;
}
