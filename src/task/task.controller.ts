import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Task } from "@prisma/client";
import { User } from "src/auth/auth.decorator";
import { TaskCreateDto } from "./dtos/taskCreate.dto";
import { TaskUpdateDto } from "./dtos/taskUpdate.dto";
import { TaskService } from "./task.service";

@Controller("task")
@UseGuards(AuthGuard("jwt"))
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async findAll(@User("id") userId: string): Promise<Task[]> {
    return await this.taskService.findAll(userId);
  }

  @Get(":id")
  async findOne(@User("id") userId: string, @Param("id") id: string): Promise<Task> {
    return await this.taskService.findOne(userId, id);
  }

  @Post()
  async create(@User("id") userId: string, @Body() body: TaskCreateDto): Promise<Task> {
    return await this.taskService.create(userId, body);
  }

  @Patch(":id")
  async update(@User("id") userId: string, @Param("id") id: string, @Body() body: TaskUpdateDto): Promise<Task> {
    return await this.taskService.update(userId, id, body);
  }

  @Delete(":id")
  async remove(@User("id") userId: string, @Param("id") id: string): Promise<Task> {
    return await this.taskService.remove(userId, id);
  }

  @Patch("complete/:id")
  async markAsCompleted(@User("id") userId: string, @Param("id") id: string): Promise<Task> {
    return await this.taskService.markAsCompleted(userId, id);
  }
}
