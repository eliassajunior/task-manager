import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TaskModule } from "./task/task.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }), TaskModule],
  controllers: [AppController],
})
export class AppModule {}
