import { Injectable, NotFoundException } from "@nestjs/common";
import { Task } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { TaskCreateDto } from "./dtos/taskCreate.dto";
import { TaskUpdateDto } from "./dtos/taskUpdate.dto";

@Injectable()
export class TaskService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: string): Promise<Task[]> {
    return await this.prismaService.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: "desc",
      },
    });
  }

  async findOne(userId: string, id: string): Promise<Task> {
    const task = await this.prismaService.task.findUnique({ where: { id, userId } });
    if (!task) throw new NotFoundException("Task not found.");
    return task;
  }

  async create(userId: string, data: TaskCreateDto): Promise<Task> {
    return await this.prismaService.task.create({ data: { ...data, userId } });
  }

  async update(userId: string, id: string, data: TaskUpdateDto): Promise<Task> {
    await this.findOne(userId, id);
    return await this.prismaService.task.update({
      where: {
        id,
      },
      data: {
        ...data,
        description: data.description || null,
        userId,
      },
    });
  }

  async remove(userId: string, id: string): Promise<Task> {
    await this.findOne(userId, id);
    return await this.prismaService.task.delete({ where: { id, userId } });
  }

  async markAsCompleted(userId: string, id: string): Promise<Task> {
    const task = await this.findOne(userId, id);
    return await this.prismaService.task.update({
      where: {
        id,
        userId,
      },
      data: {
        isComplete: !task.isComplete,
      },
    });
  }
}
