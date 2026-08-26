import { Type } from "class-transformer";
import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateAulaDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idModulo!: number;

    @IsString()
    @MinLength(1)
    titulo!: string;

    @IsString()
    @MinLength(1)
    tipoConteudo!: string;

    @IsString()
    @MinLength(1)
    urlConteudo!: string;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    duracaoMinutos!: number;

    @IsString()
    @MinLength(1)
    ordem!: string;
}
