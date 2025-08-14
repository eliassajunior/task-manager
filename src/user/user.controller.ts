import { Controller, Delete, Param } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(":email")
  async remove(@Param("email") email: string): Promise<User> {
    return await this.userService.remove(email);
  }
}
