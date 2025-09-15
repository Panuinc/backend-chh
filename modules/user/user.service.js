import { UserRepository } from "./user.repository";

export class UserService {
  constructor() {
    this.repo = new UserRepository();
  }

  async getUsers() {
    return this.repo.findAll();
  }

  async getUser(userId) {
    return this.repo.findById(userId);
  }

  async createUser(data) {
    return this.repo.create(data);
  }

  async updateUser(userId, data) {
    return this.repo.update(userId, data);
  }
}
