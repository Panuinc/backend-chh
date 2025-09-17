import { UserRepository } from "@/modules/user/user.repository";

export const UserValidator = {
  async isDuplicateUserEmail(email) {
    const user = await UserRepository.findByEmail(email);
    return !!user;
  },
};
