import { Transform } from "class-transformer";
import { IsString, MinLength, IsNumber, Min } from "class-validator";

export class CreatePlanoDto {
    @IsString()
    @MinLength(1)
    nome!: string;

    @IsString()
    @MinLength(1)
    descricao!: string;

    @IsNumber()
    @Min(0)
    //0.00, 10.00, 100.00
    @Transform(({value}) => parseFloat(value))
    preco!: number;

    @IsNumber()
    @Min(0)
    duracaoMeses!: number;
}
