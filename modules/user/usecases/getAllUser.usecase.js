import { UserService } from "@/modules/user/user.service";

export async function GetAllUserUseCase(page = 1, limit = 1000000) {
  const skip = (page - 1) * limit;
  const users = await UserService.getAllPaginated(skip, limit);
  const total = await UserService.countAll();

  return { users, total };
}
