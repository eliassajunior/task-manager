import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Task } from "@prisma/client";
import { User } from "src/auth/auth.decorator";
import { CreateTaskDto } from "./dtos/createTask.dto";
import { UpdateTaskDto } from "./dtos/updateTask.dto";
import { TaskService } from "./task.service";

@Controller("task")
@UseGuards(AuthGuard("jwt"))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(@User() user: { id: string; email: string }): Promise<Task[]> {
    return await this.taskService.findAll(user.id);
  }

  @Get(":id")
  async findOne(@User() user: { id: string; email: string }, @Param("id") id: string): Promise<Task> {
    return await this.taskService.findOne(user.id, id);
  }

  @Post()
  async create(@User() user: { id: string; email: string }, @Body() body: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(user.id, body);
  }

  @Patch(":id")
  async update(
    @User() user: { id: string; email: string },
    @Param("id") id: string,
    @Body() body: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(user.id, id, body);
  }

  @Delete(":id")
  async remove(@User() user: { id: string; email: string }, @Param("id") id: string): Promise<Task> {
    return await this.taskService.remove(user.id, id);
  }

  @Patch("complete/:id")
  async markAsComplete(@User() user: { id: string; email: string }, @Param("id") id: string): Promise<Task> {
    return await this.taskService.markAsComplete(user.id, id);
  }
}
