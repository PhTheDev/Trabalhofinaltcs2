import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNumber, IsString, Min, MinLength } from "class-validator";
import { Nivel } from "src/generated/prisma/enums";

export class CreateCursoDto {
    @IsString()
    @MinLength(1)
    titulo!: string;
    
    @IsString()
    @MinLength(1)
    descricao!: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idInstrutor!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCategoria!: number;

    @IsEnum(Nivel)
    nivel!: Nivel;

    @Type(() => Date)
    @IsDate()
    dataPublicacao!: Date;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    totalHoras!: number;

    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    preco!: number;
}
