import { UserController } from "@/modules/user/user.controller";

export async function GET() {
  return UserController.getUsers();
}

export async function POST(req) {
  return UserController.createUser(req);
}
