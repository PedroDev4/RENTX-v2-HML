import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { AppError } from "@shared/errors/AppError";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import auth from "@config/auth";
import { IDateProvider } from "@shared/container/Providers/DateProvider/IDateProvider";

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
    refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("UsersTokensRepository")
        private usersTokensRepository: IUsersTokensRepository,
        @inject("DateProvider")
        private dateProvider: IDateProvider

    ) { }

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

        const { expires_in_token, secret_token, secret_refresh_token, expires_in_refresh_token, expires_refresh_token_days } = auth;

        if (!user) {
            throw new AppError("Email or password Incorret.");
        }

        // Verify if Password is corret

        const userPassword = await compare(password, user.password);

        if (!userPassword) {
            throw new AppError("Email or password Incorret.");
        }

        // then... Generate JWT

        const token = sign({}, secret_token, {
            subject: user.id,
            expiresIn: expires_in_token,
        });


        // refresh_token generation
        const refresh_token = sign({ email }, secret_refresh_token, {
            subject: user.id,
            expiresIn: expires_in_refresh_token
        });

        const refresh_token_expires_date = String(this.dateProvider.addDays(expires_refresh_token_days));

        await this.usersTokensRepository.create({
            user_id: user.id,
            expires_date: refresh_token_expires_date,
            refresh_token

        });

        const tokenReturn: IResponse = {
            token,
            user: {
                name: user.name,
                email: user.email,
            },
            refresh_token
        };

        return tokenReturn;
    }
}

export { AuthenticateUserUseCase };
