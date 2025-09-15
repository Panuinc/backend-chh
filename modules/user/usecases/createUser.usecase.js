import { UserService } from "../user.service";

export class CreateUserUseCase {
  constructor(service) {
    this.service = service;
  }

  async execute(data) {
    return this.service.createUser(data);
  }
}
