import { UserService } from "@/modules/user/user.service";

export async function GetUserByIdUseCase(userId) {
  if (!userId || typeof userId !== "string") {
    throw { status: 400, message: "Invalid user ID" };
  }

  const user = await UserService.getById(userId);
  if (!user) throw { status: 404, message: "User not found" };

  return user;
}
