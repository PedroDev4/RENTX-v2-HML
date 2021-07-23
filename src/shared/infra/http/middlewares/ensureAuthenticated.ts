import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { UsersTokensRepository } from "@modules/accounts/infra/typeorm/repositories/UsersTokensRepository";
import auth from "@config/auth";

interface ITokenPayLoad {
    sub: string;
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authHeader = request.headers.authorization;

    const usersTokensRepository = new UsersTokensRepository();

    if (!authHeader) {
        throw new AppError("Token Missing!", 401);
    }

    // ["Bearer","Jyeisjaeesajn32u3kskj2sa"];
    // [0]  = Bearer
    // [1] = Jyeisjaeesajn32u3kskj2sa
    const [, token] = authHeader.split(" ");

    // Verify if token is valid

    try {
        const { sub: user_id } = verify(
            token,
            auth.secret_refresh_token
        ) as ITokenPayLoad;

        const usersRepository = new UsersRepository();
        const user = await usersRepository.findById(user_id);

        const userToken = await usersTokensRepository.findByUserIdAndRefreshToken(user_id, token);

        if (!userToken) {
            throw new AppError("Invalid Refresh Token provided", 401);
        }

        if (!user) {
            throw new AppError("User does not Exists!", 401);
        }

        request.user = {
            // Passando o obejeto "user" para nossa requisição "pra frente"
            id: user.id,
        };

        next();
    } catch {
        throw new AppError("Invalid Token!", 401);
    }
}
