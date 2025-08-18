import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TaskCreateDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
