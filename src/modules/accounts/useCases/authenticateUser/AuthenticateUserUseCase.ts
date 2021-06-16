import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

interface IRequest {
    email: string;
    password: string;
    driver_license: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {
        //
    }

    async execute({
        email,
        password,
        driver_license,
    }: IRequest): Promise<IResponse> {
        // Verify if user Exists
        const user = await this.usersRepository.findByEmailDriverLicense(
            email,
            driver_license
        );

        if (!user) {
            throw new AppError("Email or password Incorret.");
        }

        // Verify if Password is corret

        const userPassword = await compare(password, user.password);

        if (!userPassword) {
            throw new AppError("Email or password Incorret.");
        }

        // then... Generate JWT

        const token = sign({}, "f81243572aa4c126aaba36b59496d48f", {
            subject: user.id,
            expiresIn: "1d",
        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
