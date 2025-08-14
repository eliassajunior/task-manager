import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { UserService } from "src/user/user.service";
import { SignInDto } from "./dtos/signIn.dto";
import { SignUpDto } from "./dtos/signUp.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(data: SignUpDto): Promise<Omit<User, "password">> {
    const hash = await bcrypt.hash(data.password, 10);

    const newUser = await this.userService.create({ ...data, password: hash });
    const { password, ...user } = newUser;

    return user;
  }

  async signIn(data: SignInDto): Promise<{ access_token: string }> {
    const user = await this.userService.findUserByEmail(data.email);

    const password = await bcrypt.compare(data.password, user.password);
    if (!password) throw new ForbiddenException("invalid password.");

    return await this.generateToken(user.id, user.email);
  }

  private async generateToken(id: string, email: string): Promise<{ access_token: string }> {
    const payload = { sub: id, email };
    const token = this.jwtService.sign(payload, {
      privateKey: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN"),
    });

    return { access_token: token };
  }
}
