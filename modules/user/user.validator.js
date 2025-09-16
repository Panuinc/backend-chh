import { UserRepository } from "@/modules/user/user.repository";

export const UserValidator = {
  async isDuplicateUserName(name) {
    const user = await UserRepository.findByName(name);
    return !!user;
  },
};
