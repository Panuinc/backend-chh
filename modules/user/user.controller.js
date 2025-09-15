import { NextResponse } from "next/server";
import { UserService } from "./user.service";
import { CreateUserUseCase } from "./usecases/createUser.usecase";
import { UpdateUserUseCase } from "./usecases/updateUser.usecase";
import { GetUserUseCase } from "./usecases/getUser.usecase";
import { GetUsersUseCase } from "./usecases/getUsers.usecase";
import { userPostSchema, userPutSchema } from "./user.schema";

const service = new UserService();

export class UserController {
  static async getUsers() {
    const usecase = new GetUsersUseCase(service);
    const users = await usecase.execute();
    return NextResponse.json(users);
  }

  static async getUser(userId) {
    const usecase = new GetUserUseCase(service);
    const user = await usecase.execute(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  }

  static async createUser(req) {
    const body = await req.json();
    const parse = userPostSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.format() }, { status: 400 });
    }

    const usecase = new CreateUserUseCase(service);
    const user = await usecase.execute(parse.data);
    return NextResponse.json(user);
  }

  static async updateUser(req, userId) {
    const body = await req.json();
    const parse = userPutSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: parse.error.format() }, { status: 400 });
    }

    const usecase = new UpdateUserUseCase(service);
    const user = await usecase.execute(userId, parse.data);
    return NextResponse.json(user);
  }
}
