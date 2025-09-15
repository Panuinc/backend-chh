import { UserService } from "../user.service";

export class UpdateUserUseCase {
  constructor(service) {
    this.service = service;
  }

  async execute(userId, data) {
    return this.service.updateUser(userId, data);
  }
}
