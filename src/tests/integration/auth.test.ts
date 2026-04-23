import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";
import { app } from "../../app.js";
import request from "supertest";

vi.mock("../../lib/prisma.js");

import AuthService from "../../services/auth.service.js";
import AuthController from "../../controllers/auth.controller.js";
import { prisma } from "../__mocks__/@prisma/prisma.js";

let authService: AuthService;
let authController: AuthController;

beforeAll(() => {
  authService = new AuthService(prisma);
  authController = new AuthController(authService);
});

describe("Auth Integration Test", () => {
  describe("userLogin", () => {
    it("should create a new user and return a token", async () => {
      const user = {
        email: "test@example.com",
        password: "password",
        user_role: "admin",
      };

      const response = await request(app).post("/login/").send(user);

      expect(response.status).toBe(200);
    });
  });
});
