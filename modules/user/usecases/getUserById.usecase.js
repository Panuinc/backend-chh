import { UserService } from "@/modules/user/user.service";

export async function GetUserByIdUseCase(userId) {
  const id = parseInt(userId, 10);
  if (!Number.isInteger(id)) throw { status: 400, message: "Invalid user ID" };

  const user = await UserService.getById(id);
  if (!user) throw { status: 404, message: "User not found" };

  return user;
}
