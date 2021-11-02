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
            auth.secret_token
        ) as ITokenPayLoad;

        request.user = {
            // Passando o obejeto "user" para nossa requisição "pra frente"
            id: user_id,
        };

        next();
    } catch {
        throw new AppError("Invalid Token!", 401);
    }
}
