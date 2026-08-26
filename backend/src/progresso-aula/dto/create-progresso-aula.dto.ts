import { Type } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, Min } from "class-validator";
import { Status } from "src/generated/prisma/enums";

export class CreateProgressoAulaDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idUsuario!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idAula!: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dataConclusao?: Date;

    @IsEnum(Status)
    status!: Status;
}
