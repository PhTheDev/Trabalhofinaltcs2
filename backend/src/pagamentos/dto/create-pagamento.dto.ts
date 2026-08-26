import { Transform, Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsNumber, Min } from "class-validator";
import { MetodoPagamento } from "src/generated/prisma/enums";

export class CreatePagamentoDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idAssinatura!: number;

    @IsNumber()
    @Min(0)
    @Transform(({ value }) => parseFloat(value))
    valorPago!: number;

    @Type(() => Date)
    @IsDate()
    dataPagamento!: Date;

    @IsEnum(MetodoPagamento)
    metodoPagamento!: MetodoPagamento;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idTransacaoGateway!: number;
}
