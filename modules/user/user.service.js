import { UserRepository } from "@/modules/user/user.repository";

export class UserService {
  static getAllPaginated(skip, take) {
    return UserRepository.getAll(skip, take);
  }

  static countAll() {
    return UserRepository.countAll();
  }

  static getById(userId) {
    return UserRepository.findById(userId);
  }

  static getByName(userName) {
    return UserRepository.findByName(userName);
  }

  static create(data) {
    return UserRepository.create(data);
  }

  static update(userId, data) {
    return UserRepository.update(userId, data);
  }
}
