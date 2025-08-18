import { IsOptional, IsString } from "class-validator";

export class TaskUpdateDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
