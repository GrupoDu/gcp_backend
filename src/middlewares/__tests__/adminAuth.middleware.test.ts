import { describe, expect, it, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { adminAuthMiddleware } from "../adminAuth.middleware.js";

describe("Teste de middleware de acesso em rotas.", () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: "Bearer fake-token",
      },
    };

    mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn(() => mockRes),
    };

    mockNext = vi.fn();
  });

  it("Deve validar e permitir usuário.", () => {
    vi.spyOn(jwt, "verify").mockReturnValue({
      user_id: randomUUID(),
      user_type: "Admin",
    } as any);

    adminAuthMiddleware(mockReq, mockRes, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it("Deve bloquear acesso a rota.", () => {
    vi.spyOn(jwt, "verify").mockReturnValue({
      user_id: randomUUID(),
      user_type: "Cliente",
    } as any);

    adminAuthMiddleware(mockReq, mockRes, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: expect.stringContaining("não autorizado"),
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});
