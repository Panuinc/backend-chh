import { UserController } from "@/modules/user/user.controller";

export async function GET(_req, context) {
  const { userId } = await context.params;
  return UserController.getUser(userId);
}

export async function PUT(req, context) {
  const { userId } = await context.params;
  return UserController.updateUser(req, userId);
}
