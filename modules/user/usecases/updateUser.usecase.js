import { userPutSchema } from "@/modules/user/user.schema";
import { UserService } from "@/modules/user/user.service";
import { getLocalNow } from "@/lib/getLocalNow";

export async function UpdateUserUseCase(data) {
  const parsed = userPutSchema.safeParse(data);
  if (!parsed.success) {
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const existing = await UserService.getById(parsed.data.userId);
  if (!existing) {
    throw { status: 404, message: "User not found" };
  }

  return UserService.update(parsed.data.userId, {
    ...parsed.data,
    userFirstName: parsed.data.userFirstName.trim().toLowerCase(),
    userUpdateAt: getLocalNow(),
  });
}
