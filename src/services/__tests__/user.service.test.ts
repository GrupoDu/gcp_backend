import { describe, expect, it, beforeEach, vi } from "vitest";
import jwt, { type JwtPayload } from "jsonwebtoken";
import UserService from "../user.service.js";
import type { IUserPublic } from "../../types/user.interface.js";
import { randomUUID } from "crypto";

vi.mock("../../../lib/prisma.js");

import prisma from "../../tests/__mocks__/@prisma/prisma.js";

describe("Teste de variáveis de ambiente.", () => {
  it("deve carrega a variável SALT_ROUNDS", () => {
    console.log(`SALT_ROUNDS: ${process.env.SALT_ROUNDS}`);
    console.log("Tipo:", typeof process.env.SALT_ROUNDS);
  });

  it("deve carregar a variável JWT_SECRET.", () => {
    console.log(`JWT_SECRET: ${process.env.JWT_SECRET}`);
    console.log("Tipo:", typeof process.env.JWT_SECRET);
  });
});

describe("Testes de registro", () => {
  let userService: UserService;
  let jwtSpyMock: any;

  beforeEach(() => {
    jwtSpyMock = vi.spyOn(jwt, "verify");
    userService = new UserService(prisma);
  });

  it("Deve criar um novo usuário.", async () => {
    const newMockedUser = {
      user_id: randomUUID(),
      name: "Mario",
      email: "mario@email.com",
      password: "1234",
      user_type: "Cliente",
    };

    jwtSpyMock.mockReturnValue({
      user_id: "fake-id",
      user_type: "Admin",
    });

    prisma.user.create.mockResolvedValue(newMockedUser);

    const newUser = await userService.registerNewUser(
      newMockedUser,
      jwtSpyMock,
    );

    expect(newUser.name).toBe("Mario");
  });

  it("Não deve permitir a criação do usuário", async () => {
    jwtSpyMock.mockReturnValue({
      user_id: "fake-id",
      user_type: "Cliente",
    });

    await expect(
      userService.registerNewUser(
        {
          name: "Mario",
          email: "mario@email.com",
          password: "1234",
          user_type: "Cliente",
        },
        jwtSpyMock,
      ),
    ).rejects.toThrowError();
  });
});

describe("Testes de update.", () => {
  let userService: UserService;
  let userList: IUserPublic[];
  let jwtSpyMock: any;

  beforeEach(() => {
    jwtSpyMock = vi.spyOn(jwt, "verify");

    userList = [
      {
        user_id: randomUUID(),
        name: "Pedro",
        email: "pedro@email.com",
        user_type: "Cliente",
      },
      {
        user_id: randomUUID(),
        name: "Marcos",
        email: "marcos@email.com",
        user_type: "Admin",
      },
      {
        user_id: randomUUID(),
        name: "Italo",
        email: "italo@email.com",
        user_type: "Admin",
      },
      {
        user_id: randomUUID(),
        name: "Thiago",
        email: "thiago@email.com",
        user_type: "Cliente",
      },
    ];

    userService = new UserService(prisma);
  });

  it("Não deve permitir alteração de dados do usuário.", async () => {
    jwtSpyMock.mockReturnValue({
      user_id: "fake-id",
      user_type: "Cliente",
    });

    await expect(
      userService.updateUserData(
        { name: "Rafael" },
        userList[1]!.user_id,
        jwtSpyMock,
      ),
    ).rejects.toThrowError();
  });

  it("Deve lançar um erro por falta de dados para atualizar.", async () => {
    jwtSpyMock.mockReturnValue({
      user_id: "fake-id",
      user_type: "Admin",
    });

    await expect(
      userService.updateUserData({}, userList[1]!.user_id, jwtSpyMock),
    ).rejects.toThrowError();
  });
});

describe("Testes de delete.", () => {
  let userService: UserService;
  let userList: IUserPublic[];
  let jwtSpyMock: any;

  beforeEach(() => {
    jwtSpyMock = vi.spyOn(jwt, "verify");

    userList = [
      {
        user_id: randomUUID(),
        name: "Pedro",
        email: "pedro@email.com",
        user_type: "Cliente",
      },
      {
        user_id: randomUUID(),
        name: "Marcos",
        email: "marcos@email.com",
        user_type: "Admin",
      },
      {
        user_id: randomUUID(),
        name: "Italo",
        email: "italo@email.com",
        user_type: "Admin",
      },
      {
        user_id: randomUUID(),
        name: "Thiago",
        email: "thiago@email.com",
        user_type: "Cliente",
      },
    ];

    userService = new UserService(prisma);
  });

  it("Não deve permitir a remoção do usuário", async () => {
    jwtSpyMock.mockReturnValue({
      user_id: "fake-id",
      user_type: "Cliente",
    });

    await expect(
      userService.deleteUserData(userList[0]!.user_id, jwtSpyMock),
    ).rejects.toThrowError();
  });
});
