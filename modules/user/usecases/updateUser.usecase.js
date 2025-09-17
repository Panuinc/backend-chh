import { userPutSchema } from "@/modules/user/user.schema";
import { UserService } from "@/modules/user/user.service";
import { UserValidator } from "@/modules/user/user.validator";
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

  const normalizedEmail = parsed.data.userEmail.trim().toLowerCase();
  if (normalizedEmail !== existing.userEmail) {
    const duplicate = await UserValidator.isDuplicateUserEmail(normalizedEmail);
    if (duplicate) {
      throw {
        status: 409,
        message: `User with email '${normalizedEmail}' already exists`,
      };
    }
  }

  return UserService.update(parsed.data.userId, {
    ...parsed.data,
    userEmail: normalizedEmail,
    userFirstName: parsed.data.userFirstName.trim().toLowerCase(),
    userUpdateAt: getLocalNow(),
  });
}
