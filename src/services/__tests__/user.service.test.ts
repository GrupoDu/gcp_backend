import { describe, expect, it, beforeEach, vi } from "vitest";
import UserService from "../user.service.js";
import type { IUserPublic } from "../../types/user.interface.js";
import { randomUUID } from "crypto";

vi.mock("../../../lib/prisma.js");

import prisma from "../../tests/__mocks__/@prisma/prisma.js";
import { responseMessages } from "../../constants/messages.constants.js";

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

  beforeEach(() => {
    userService = new UserService(prisma);
  });

  it("Deve criar um novo usuário.", async () => {
    const newMockedUser = {
      user_id: randomUUID(),
      name: "Mario",
      email: "mario@email.com",
      password: "1234",
      user_role: "cliente",
    };

    prisma.user.create.mockResolvedValue(newMockedUser);

    const newUser = await userService.registerNewUser(newMockedUser);

    expect(newUser.name).toBe("Mario");
  });

  it("Deve dar erro de campos não preenchidos.", async () => {
    const newUser = {
      emptyName: {
        name: "",
        email: "pedro@email.com",
        password: "123",
        user_role: "admin",
      },
      emptyEmail: {
        name: "",
        email: "pedro@email.com",
        password: "123",
        user_role: "admin",
      },
      emptyPassword: {
        name: "Pedro",
        email: "pedro@email.com",
        password: "",
        user_role: "admin",
      },
      emptyUserRole: {
        name: "Pedro",
        email: "pedro@email.com",
        password: "123",
        user_role: "",
      },
    };

    for (const emptyTest of Object.values(newUser)) {
      await expect(userService.registerNewUser(emptyTest)).rejects.toThrowError(
        responseMessages.fillAllFieldMessage,
      );
    }
  });

  it("Deve retornar erro de formato de email inválido.", async () => {
    const newUserWrongEmailFormat = {
      email: "wrongÉmail @gmail.com",
      name: "Pedro",
      password: "12345",
      user_role: "cliente",
    };

    await expect(
      userService.registerNewUser(newUserWrongEmailFormat),
    ).rejects.toThrowError("Formato de email inválido.");
  });
});

describe("Testes de update.", () => {
  let userService: UserService;
  let userList: IUserPublic[];

  beforeEach(() => {
    userList = [
      {
        user_id: randomUUID(),
        name: "Pedro",
        email: "pedro@email.com",
        user_role: "cliente",
      },
      {
        user_id: randomUUID(),
        name: "Marcos",
        email: "marcos@email.com",
        user_role: "admin",
      },
      {
        user_id: randomUUID(),
        name: "Italo",
        email: "italo@email.com",
        user_role: "admin",
      },
      {
        user_id: randomUUID(),
        name: "Thiago",
        email: "thiago@email.com",
        user_role: "cliente",
      },
    ];

    userService = new UserService(prisma);
  });

  it("Deve lançar um erro por falta de dados para atualizar.", async () => {
    await expect(
      userService.updateUserData({}, userList[1]!.user_id),
    ).rejects.toThrowError();
  });
});

describe("Testes de delete.", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(prisma);
  });

  it("Deve dar error por falta de uuid", async () => {
    const uuidTests = {
      emptyString: {
        entry: "",
        toThrow: "id do usuário não fornecido.",
      },
      nullUuid: {
        entry: null,
        toThrow: "id do usuário não fornecido.",
      },
      undefinedUuid: {
        entry: undefined,
        toThrow: "id do usuário não fornecido.",
      },
      userNotFind: {
        entry: "a",
        toThrow: "Usuário não encontrado.",
      },
    };

    for (const test of Object.values(uuidTests)) {
      await expect(userService.deleteUserData(test.entry)).rejects.toThrowError(
        test.toThrow,
      );
    }
  });
});
