import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { SignInDto } from "./dtos/signIn.dto";
import { SignUpDto } from "./dtos/signUp.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtServce: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signIn(data: SignInDto): Promise<{ access_token: string }> {
    const isUserValid = await this.prismaService.user.findUnique({ where: { email: data.email } });
    if (!isUserValid) throw new ForbiddenException("Invalid e-mail.");

    const isPasswordValid = await bcrypt.compare(data.password, isUserValid.password);
    if (!isPasswordValid) throw new ForbiddenException("Invalid password.");

    return await this.generateToken({ sub: isUserValid.id, email: isUserValid.email });
  }

  async singUp(data: SignUpDto): Promise<Omit<User, "password">> {
    const isUserValid = await this.prismaService.user.findUnique({ where: { email: data.email } });
    if (isUserValid) throw new ConflictException("E-mail unavailable.");

    const hash = await bcrypt.hash(data.password, 10);

    const newUser = await this.prismaService.user.create({ data: { ...data, password: hash } });

    const { password, ...result } = newUser;
    return result;
  }

  private async generateToken(payload: { sub: string; email: string }): Promise<{ access_token: string }> {
    const token = await this.jwtServce.signAsync(payload, {
      secret: this.configService.get<string>("JWT_SECRET"),
      expiresIn: this.configService.get<string>("JWT_EXPIRES_IN"),
    });

    return { access_token: token };
  }
}
