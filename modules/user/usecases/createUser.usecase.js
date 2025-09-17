import { userPostSchema } from "@/modules/user/user.schema";
import { UserService } from "@/modules/user/user.service";
import { UserValidator } from "@/modules/user/user.validator";
import { getLocalNow } from "@/lib/getLocalNow";

export async function CreateUserUseCase(data) {
  const parsed = userPostSchema.safeParse(data);
  if (!parsed.success) {
    throw {
      status: 422,
      message: "Invalid input",
      details: parsed.error.flatten().fieldErrors,
    };
  }

  const normalizedEmail = parsed.data.userEmail.trim().toLowerCase();
  const duplicate = await UserValidator.isDuplicateUserEmail(normalizedEmail);
  if (duplicate) {
    throw { status: 409, message: `User with email '${normalizedEmail}' already exists` };
  }

  return UserService.create({
    ...parsed.data,
    userEmail: normalizedEmail,
    userCreateAt: getLocalNow(),
  });
}
