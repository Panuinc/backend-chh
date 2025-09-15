import { UserService } from "../user.service";

export class GetUsersUseCase {
  constructor(service) {
    this.service = service;
  }

  async execute() {
    return this.service.getUsers();
  }
}
