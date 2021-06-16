import { AppError } from "@shared/errors/AppError";

import { ICreateUserDTO } from "../../DTOs/ICreateUserDTO";
import { UsersRepositoryInMemory } from "../../repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
        authenticateUserUseCase = new AuthenticateUserUseCase(
            usersRepositoryInMemory
        );
    });

    it("Should be able to authenticate an existing user", async () => {
        const user: ICreateUserDTO = {
            driver_license: "0123",
            email: "user@test.com",
            password: "1234",
            name: "User test",
        };

        await createUserUseCase.execute(user);

        const result = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password,
            driver_license: user.driver_license,
        });

        expect(result).toHaveProperty("token");
    });

    it("Should NOT be able to authenticate a nonexistent user", () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "false@email",
                password: "1234",
                driver_license: "12345",
            });
        }).rejects.toBe(new AppError("Email or password Incorret."));
    });

    it("Should NOT be able to authenticate a user with incorrect password", async () => {
        expect(async () => {
            const user: ICreateUserDTO = {
                driver_license: "0123",
                email: "user@test.com",
                password: "1234",
                name: "User test",
            };

            await createUserUseCase.execute(user);

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "123",
                driver_license: user.driver_license,
            });
        }).rejects.toBe(new AppError("Email or password Incorret."));
    });
});
