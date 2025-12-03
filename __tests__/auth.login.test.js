import { jest } from "@jest/globals";
import { login } from "../controllers/authControllers.js";

import userService from "../services/userService.js";
import passwordService from "../services/passwordService.js";
import tokenService from "../services/tokenService.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("login controller", () => {
  it("should return 200, token and user object for valid credentials", async () => {
    const mockedUser = {
      id: 1,
      email: "test@example.com",
      password: "hashed-password",
      subscription: "starter",
      avatarURL: null,
    };

    const mockedToken = "mocked-token";

    const req = {
      body: {
        email: mockedUser.email,
        password: "passmeplease",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(userService, "getUserByEmail").mockResolvedValue(mockedUser);
    jest.spyOn(passwordService, "checkPassword").mockResolvedValue(true);
    jest.spyOn(tokenService, "createToken").mockReturnValue(mockedToken);
    jest.spyOn(userService, "updateUser").mockResolvedValue(mockedUser);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: mockedToken,
      user: {
        email: mockedUser.email,
        subscription: mockedUser.subscription,
        avatarURL: mockedUser.avatarURL,
      },
    });
  });

  it("should throw 401 error for not found email", async () => {
    const req = {
      body: {
        email: "invalid@example.com",
        password: "passmeplease",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(userService, "getUserByEmail").mockResolvedValue(null);
    jest.spyOn(passwordService, "checkPassword").mockResolvedValue(undefined);
    jest.spyOn(tokenService, "createToken").mockReturnValue(undefined);
    jest.spyOn(userService, "updateUser").mockResolvedValue(undefined);

    await expect(login(req, res)).rejects.toMatchObject({
      status: 401,
      message: "Email or password invalid",
    });

    expect(userService.getUserByEmail).toHaveBeenCalledWith(req.body.email);

    expect(passwordService.checkPassword).not.toHaveBeenCalled();
    expect(tokenService.createToken).not.toHaveBeenCalled();
    expect(userService.updateUser).not.toHaveBeenCalled();
  });

  it("should throw 401 error for not correct password", async () => {
    const mockedUser = {
      id: 1,
      email: "test@example.com",
      password: "hashed-password",
      subscription: "starter",
      avatarURL: null,
    };

    const mockedPassword = "wrongpassword";
    const req = {
      body: {
        email: mockedUser.email,
        password: mockedPassword,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(userService, "getUserByEmail").mockResolvedValue(mockedUser);
    jest.spyOn(passwordService, "checkPassword").mockResolvedValue(false);

    await expect(login(req, res)).rejects.toMatchObject({
      status: 401,
      message: "Email or password invalid",
    });

    expect(userService.getUserByEmail).toHaveBeenCalledWith(req.body.email);
    expect(passwordService.checkPassword).toHaveBeenCalledWith(
      mockedPassword,
      mockedUser.password
    );
  });
});
