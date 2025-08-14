import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto } from "./dtos/createTask.dto";
import { UpdateTaskDto } from "./dtos/updateTask.dto";

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: string): Promise<Task[]> {
    return await this.prismaService.task.findMany({ where: { userId } });
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.prismaService.task.findFirst({ where: { id, userId } });
    if (!task) throw new NotFoundException("task not found.");
    return task;
  }

  async create(userId: string, data: CreateTaskDto): Promise<Task> {
    return await this.prismaService.task.create({ data: { ...data, userId } });
  }

  async update(userId: string, id: string, data: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(userId, id);
    return await this.prismaService.task.update({
      where: { id },
      data: { ...data, userId },
    });
  }

  async remove(userId: string, id: string): Promise<Task> {
    const user = await this.findOne(userId, id);
    return await this.prismaService.task.delete({ where: { id, userId } });
  }

  async markAsComplete(userId: string, id: string): Promise<Task> {
    const user = await this.findOne(userId, id);
    return await this.prismaService.task.update({
      where: { id },
      data: { isComplete: !user.isComplete, userId },
    });
  }
}
