import { Body, Controller, Post } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth/auth.service";
import { SignInDto } from "./auth/dtos/signIn.dto";
import { SignUpDto } from "./auth/dtos/signUp.dto";

@Controller("")
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post("signin")
  async signIn(@Body() body: SignInDto): Promise<{ access_token: string }> {
    return await this.authService.signIn(body);
  }

  @Post("signup")
  async signUp(@Body() body: SignUpDto): Promise<Omit<User, "password">> {
    return await this.authService.singUp(body);
  }
}
