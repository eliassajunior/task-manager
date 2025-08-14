import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dtos/createUser.dto";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException("user not found.");
    return user;
  }

  async create(data: CreateUserDto): Promise<User> {
    return await this.prismaService.user.create({ data });
  }

  async remove(email: string): Promise<User> {
    const user = await this.findUserByEmail(email);
    return await this.prismaService.user.delete({ where: { email } });
  }
}
