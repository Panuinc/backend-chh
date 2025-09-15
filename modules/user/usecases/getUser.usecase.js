import { UserService } from "../user.service";

export class GetUserUseCase {
  constructor(service) {
    this.service = service;
  }

  async execute(userId) {
    return this.service.getUser(userId);
  }
}
