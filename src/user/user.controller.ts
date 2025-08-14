import { Controller, Delete, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User } from "@prisma/client";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(AuthGuard("jwt"))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Delete(":email")
  async remove(@Param("email") email: string): Promise<User> {
    return await this.userService.remove(email);
  }
}
