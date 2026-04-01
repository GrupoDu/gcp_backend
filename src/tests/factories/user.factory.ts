import { randomUUID } from "node:crypto";
import type { IUser } from "../../types/user.interface.js";

export const userFactory = (overrides: Partial<IUser> = {}): IUser => ({
  user_id: randomUUID(),
  name: "Test User",
  email: "test@example.com",
  password: "hashedpassword123",
  user_type: "admin",
  ...overrides,
});
